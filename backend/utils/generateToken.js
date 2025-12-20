import jwt from "jsonwebtoken"

const generateToken = (userId, res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn : "15d"
});
    res.cookie("jwt",token,{
        maxAge:15*24*60*1000,
        httpOnly : true, //xxs attacks
        sameSite : "LAX", //CSRF attack
        secure:false
    })

}

export default generateToken;