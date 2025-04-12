import {ShortLink} from '../models/ShortLink.js';
import generateUniqueUrlId from '../utils/uniqueIdGenerator.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const createShortLink = async (req, res, next) => {
    const { originalUrl, customAlias, expiration } = req.body;
    const userId = req.user.id;

    try {
        const shortCode = customAlias || await generateUniqueUrlId();
        const existing = await ShortLink.findOne({ shortCode });

        if (existing) {
            return next(new ApiError(400, 'Alias already taken'));
        }

        const shortLink = new ShortLink({
            user: userId,
            originalUrl,
            shortCode,
            customAlias,
            expiration: expiration ? new Date(expiration) : undefined
        });

        await shortLink.save();

        const response = new ApiResponse(201, 'Short link created successfully', {
            shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
            ...shortLink._doc
        });

        return res
                .status(201)
                .json(response);
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
