import initDB from '../../../helpers/initDB'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'
import Cart from '../../../models/Cart'
initDB()

export default async (req,res)=>{
    const {name,email,password} = req.body
    console.log(name,email,password);
    try {
        if(!name||!email||!password){
            return res.status(400).json({error:"Please add all the fields"});
        }
        const user = await User.findOne({email:email})
        if(user){
            return res.status(400).json({error :"User already exists with that email"})
        }
        const hashedPassword = await bcrypt.hash(password,12)
        const newUser = await new User({
            name,
            email,
            password:hashedPassword
        })
        newUser.save()
        await new Cart({user:newUser._id}).save()
        res.json({message:"user registered successfully"})
    } catch (err) {
        console.log("error in saving ",err)
        res.json({error:"user not saved successfully"})
    }
}