import initDB from '../../../helpers/initDB'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

initDB()

export default async (req,res)=>{
    const {email,password} = req.body
    console.log(email,password);
    try {
        if(!email||!password){
            return res.status(400).json({error:"Please add all the fields"});
        }
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({error :"User does not exist with that email"})
        }
        let isMatched = await bcrypt.compare(password,user.password)
        if(!isMatched){
            res.status(400).json({error:"Email or password is not valid"})
        }
        else{
            const token = await jwt.sign({userId:user._id},process.env.JWT_SECRET)
            const {name,role,email} = user
            res.json({token:token,user:{name:name,role:role,email:email},message:"user signin successfully"})
        }
    } catch (err) {
        console.log("error in saving ",err)
        res.json({error:"user not saved successfully"})
    }
}