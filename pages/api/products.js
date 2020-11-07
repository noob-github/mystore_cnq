import initDB from '../../helpers/initDB'
initDB()
import Product from '../../models/Product'

export default async (req,res)=>{
    switch (req.method){
        case "GET":
            await getAllProducts(req,res)
            break;
        case "POST":
            await saveProduct(req,res)
            break;
    }
}

const getAllProducts = async (req,res) =>{
    const products = await Product.find()
        res.status(200).json(products)
}

const saveProduct = async (req,res)=>{
    const{name,price,description,mediaUrl} = req.body
    if(!name||!price||!description||!mediaUrl){
        return res.status(400).json({error :"please enter all the fields"})
    }
    const product = await new Product({
        name,
        price,
        description,
        mediaUrl,
    }).save()
    res.json(product)
}