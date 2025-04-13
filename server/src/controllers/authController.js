import {User} from '../models/user.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        console.log(accessToken);
        

        return {accessToken}
    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token")
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email){
        return res
        .status(400)
        .json(new ApiResponse(400,{},"Email Field is Required"))
    }

    try {
        const user = await User.findOne({ email });

        if(!user){
            return res
            .status(400)
            .json(new ApiResponse(400,{},"user not found"))
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            return res
            .status(401)
            .json(new ApiResponse(401,{},"Incorrect Password"))
        }

        const {accessToken} = await generateAccessToken(user._id)
        console.log(accessToken);
        
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200,{},"Logged in successfully!!"))
    } catch (err) {
        console.log(err);
        
        throw new ApiError(500, "Error while login")
    }
};