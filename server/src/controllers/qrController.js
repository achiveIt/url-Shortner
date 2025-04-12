import {ShortLink} from '../models/ShortLink.js';
import { generateQRCode } from '../utils/qrGenerator.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getQRCode = async (req, res, next) => {
    const { shortCode } = req.params;

    try {
        const link = await ShortLink.findOne({ shortCode });
        if (!link) {
            return next(new ApiError(404, 'Short link not found'));
        }

        const shortUrl = `${req.protocol}://${req.get('host')}/${link.shortCode}`;
        const qrImage = await generateQRCode(shortUrl);

        const response = new ApiResponse(200, 'QR code generated successfully', {
            shortUrl,
            qrCode: qrImage,
        });

        return res.status(200).json(response);
    } catch (err) {
        return next(new ApiError(500, 'Failed to generate QR code', [err.message], err.stack));
    }
};