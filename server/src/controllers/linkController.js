import {ShortLink} from '../models/ShortLink.js';
import generateUniqueUrlId from '../utils/uniqueIdGenerator.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const createShortLink = async (req, res, next) => {
    const { originalUrl, customAlias, expiration } = req.body;
    const userId = req.user.id;

    try {
        if (customAlias) {
            //We check if alias is already taken
            const existingAlias = await ShortLink.findOne({ shortCode: customAlias });
            if (existingAlias) {
                return next(new ApiError(400, 'Alias already taken'));
            }

            // Otherwise we proceed to create new link with custom alias
            const shortLink = new ShortLink({
                user: userId,
                originalUrl,
                shortCode: customAlias,
                customAlias,
                expiration: expiration ? new Date(expiration) : undefined
            });

            await shortLink.save();

            return res.status(201).json(
                new ApiResponse(201, 'Short link created successfully', {
                    shortUrl: `${req.protocol}://${req.get('host')}/${customAlias}`,
                    ...shortLink._doc
                })
            );
        }

        // Now we check if original URL already exists for this user
        const existingLink = await ShortLink.findOne({ user: userId, originalUrl });
        if (existingLink) {
            return res.status(200).json(
                new ApiResponse(200, 'Short link already exists', {
                    shortUrl: `${req.protocol}://${req.get('host')}/${existingLink.shortCode}`,
                    ...existingLink._doc
                })
            );
        }

        // Generate a new short code if original does not exist and no alias is given by user
        const shortCode = await generateUniqueUrlId();

        const shortLink = new ShortLink({
            user: userId,
            originalUrl,
            shortCode,
            expiration: expiration ? new Date(expiration) : undefined
        });

        await shortLink.save();

        return res.status(201).json(
            new ApiResponse(201, 'Short link created successfully', {
                shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
                ...shortLink._doc
            })
        );
    } catch (err) {
        return next(new ApiError(500, 'Server error', [err.message], err.stack));
    }
};

export const getAllLinks = async (req, res, next) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    try {
        const query = {
            user: userId,
            $or: [
                { originalUrl: { $regex: search, $options: 'i' } },
                { customAlias: { $regex: search, $options: 'i' } }
            ]
        };

        const links = await ShortLink.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const count = await ShortLink.countDocuments(query);

        const response = new ApiResponse(200, 'Links fetched successfully', {
            links,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        return res.status(200).json(response);
    } catch (err) {
        return next(new ApiError(500, 'Server error', [err.message], err.stack));
    }
};
