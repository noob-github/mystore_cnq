import mongoose from 'mongoose'

function initDb() {
    if(mongoose.connections[0].readyState){
        return console.log("already connected to mongo ")
    }
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    mongoose.connection.on('connected',()=>{
        console.log("connected to mongo yeeaaah")
    })
    mongoose.connection.on("error",err=>{
        console.log("error connecting to mongo",err)
    })
}

export default initDb