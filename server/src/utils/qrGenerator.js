import QRCode from 'qrcode';
import ApiError from '../utils/ApiError.js';

export const generateQRCode = async (url) => {
    try {
        return await QRCode.toDataURL(url);
    } catch (err) {
        throw new ApiError(500, 'Failed to generate QR code', [err.message], err.stack);
    }
};