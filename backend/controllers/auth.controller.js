import User from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js';

export const signup = async(req,res) => {
    try{
        const {username, password} = req.body;
        const existingUsername = await User.findOne({username})

        if(existingUsername){
            return res.status(400).json({ error: "Already Existing User"})
        }

        //hashing the password
        //123456 = sjjkshjksjsak

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password:hashedPassword
        })

        if(newUser){
            generateToken (newUser._id, res)
            await newUser.save();
            res.status(200).json({
                _id: newUser._id,
                username: newUser.username
            })
        }
        else{
            res.status(400).json({
                error: "Invalid User Data"
            })
        }


    } catch (error){
        console.log(`Error in sign Up Controller : ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }

}
export const login = async (req,res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?. password || "")

        if (!user || !isPasswordCorrect){
            return res.status(400).json({error : "invalid user password"})
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username

        })
    }
    catch (error){
        console.log(`Error in Login Controller : ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}
export const logout = async (req,res) => {
    try {

        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message:"Logout success"})
        
    }
    catch (error){
        console.log(`Error in Logout Controller : ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const getme = async (req,res) => {
    try {
        const user = await User.findOne({_id: req.user._id}).select("-password")
        res.status(200).json(user);
    }
    catch (error){
        console.log(`Error in getMe Controller : ${error}`)
        res.status(500).json({error: "Internal Server Error"})
    }
}