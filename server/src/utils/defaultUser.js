import { User } from '../models/user.js';

export const defaultUser = async () => {
    const email = 'intern@dacoid.com';
    const password = 'Test123';

    const existing = await User.findOne({ email });
    if (existing) {
        console.log('Default user already exists');
        return;
    }

    const user = new User({ email, password });
    await user.save();
    console.log('Default user seeded:', email);
};