import { nanoid } from 'nanoid';
import {ShortLink} from '../models/ShortLink.js';

const generateUniqueShortCode = async () => {
    let shortCode = nanoid(6); 

    while (true) {
        const existingLink = await ShortLink.findOne({ shortCode }); 

        if (!existingLink) break;  

        shortCode = nanoid(6);
    }

    return shortCode; 
};

export default generateUniqueShortCode;