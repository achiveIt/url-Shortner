import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    linkId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ShortLink', 
        required: true 
    },
    ip: String,
    userAgent: String,
    deviceType: String,
    browser: String,
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

export const Analytics =  mongoose.model('Analytics', analyticsSchema);