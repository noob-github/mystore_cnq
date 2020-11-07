import Authenticated from '../../helpers/authenticated'
import Order from '../../models/Order'
import initDB from '../../helpers/initDB'
import product from '../../models/Product'
 
initDB()

export default Authenticated(async (req,res)=>{
    const orders = await Order.find({user:req.userId})
    .populate("products.product")
    res.json(orders)
})