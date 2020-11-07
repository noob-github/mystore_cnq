import User from '../../models/User'
import Authenticated from '../../helpers/authenticated'

export default async (req,res)=>{
    switch(req.method){
        case "GET":
            await fetchUsers(req,res)
            break;
        case "PUT" :
            await changeRole(req,res)
            break;
    }
}

const fetchUsers =  Authenticated(async (req,res)=>{
    const users = await User.find({_id:{$ne:req.userId}}).select("-password")
    res.json(users)
})

const changeRole = Authenticated(async (req,res)=>{
    const {_id,role} = req.body
    let newRole = role==="user"?"admin":"user"
    console.log(newRole)
    const user = await User.findOneAndUpdate({_id},
        {role:newRole},{new:true}).select("-password")
    user.role = newRole
    res.json(user)
})