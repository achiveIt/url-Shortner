import {ShortLink} from '../models/ShortLink.js';
import {Analytics} from '../models/Analytics.js';
import useragent from 'useragent';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const handleRedirect = async (req, res, next) => {
    const { shortCode } = req.params;

    try {
        const link = await ShortLink.findOne({ shortCode });

        if (!link || (link.expiration && new Date() > new Date(link.expiration))) {
            return next(new ApiError(404, 'Link expired or not found.'));
        }

        link.totalClicks++;
        await link.save();

        const ua = useragent.parse(req.headers['user-agent']);

        const analytics = new Analytics({
            linkId: link._id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            deviceType: ua.device.toString(),
            browser: ua.family
        });

        await analytics.save();

        
        console.log(new ApiResponse(200, 'Analytics recorded', {
            shortCode: link.shortCode,
            redirectedTo: link.originalUrl,
            totalClicks: link.totalClicks
        }));

        
        return res.redirect(link.originalUrl);
    } catch (err) {
        return next(new ApiError(500, 'Server Error', [err.message], err.stack));
    }
};