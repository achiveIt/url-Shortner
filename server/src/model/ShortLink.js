import mongoose from 'mongoose';

const shortLinkSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    originalUrl: { 
        type: String, 
        required: true 
    },
    shortCode: { 
        type: String, 
        required: true, 
        unique: true 
    },
    customAlias: { 
        type: String 
    },
    expiration: { 
        type: Date 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    totalClicks: { 
        type: Number, 
        default: 0 
    }
});

export const ShortLink =  mongoose.model('ShortLink', shortLinkSchema);