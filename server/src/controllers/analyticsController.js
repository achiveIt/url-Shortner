import { ShortLink } from '../models/ShortLink.js';
import { Analytics } from '../models/Analytics.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getAnalyticsForUser = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const userLinks = await ShortLink.find({ createdBy: userId });

        const linkIdToDataMap = {};
        userLinks.forEach(link => {
            linkIdToDataMap[link._id.toString()] = {
                shortId: link.shortCode,
                originalUrl: link.originalUrl
            };
        });

        const linkIds = userLinks.map(link => link._id);

        const analyticsRecords = await Analytics.find({ linkId: { $in: linkIds } }).sort({ timestamp: -1 });

        const fullAnalytics = analyticsRecords.map(record => ({
            _id: record._id,
            linkId: record.linkId,
            shortId: linkIdToDataMap[record.linkId.toString()].shortId,
            originalUrl: linkIdToDataMap[record.linkId.toString()].originalUrl,
            ip: record.ip,
            userAgent: record.userAgent,
            deviceType: record.deviceType,
            browser: record.browser,
            timestamp: record.timestamp,
        }));

        return res.status(200).json(new ApiResponse(200, fullAnalytics, 'Fetched analytics'));
    } catch (err) {
        return next(new ApiError(500, 'Failed to fetch analytics', [err.message], err.stack));
    }
};