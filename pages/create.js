import React,{useState} from 'react'
import baseUrl from '../helpers/baseUrl'
import {parseCookies} from "nookies"



const Create = () =>{
    const [name,setName] = useState('')
    const [price,setPrice] = useState('')
    const [description,setDescription] = useState('')
    const [media,setMedia] = useState("")
    
    let  handleSubmit = async (e) =>{
        e.preventDefault()
        let mediaUrl = await imageUpload()
        
        const res = await fetch(`${baseUrl}/api/products`,{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                price,
                mediaUrl:mediaUrl,
                description
            })
        })
        const data = await res.json()
    
        if(data.error){
            console.log("Error in saving",data.error)
        }
    }

    const imageUpload= async ()=>{
        let data = new FormData() 
        data.append("file",media)
        data.append('upload_preset','mystore_cnq')
        data.append('folder_name','mystore_cnq')
        data.append('cloud_name','a2k')
        let res = await fetch("https://api.cloudinary.com/v1_1/a2k/image/upload",{
            method:"POST",
            body:data
        })
        let dataReturned = await res.json()
        console.log(dataReturned.url)
        return dataReturned.url
    }

    return(
        <React.Fragment>
        <form className="mt-3" onSubmit={e=>handleSubmit(e)}>
            <div className="form-group">
            <input className="form-control" type="text" name="name" placeholder="Enter name" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div className="form-group">
            <input className="form-control" type="text" name="price" placeholder="Enter price" value={price} onChange={e=>setPrice(e.target.value)}/>
            </div>
            <div className="form-group">
            <input id="file-input" className="form-control-file border" type="file" accept="image/jpeg image/jpg image/png" placeholder="Select file" onChange={e=>{
                e.persist()
                console.log(e.target.files[0])
               setMedia(e.target.files[0])
                }}/>
            </div>
            <div className="form-group row">
                <img className="col-12" src={media?URL.createObjectURL(media):""}/>
            </div>
            <div className="form-group">
                <textarea className="form-control" row="2" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Enter Description"></textarea>
            </div>
            <div className="form-group">
                <button className="btn btn-primary" type="submit">
                    Submit<i className="fa fa-paper-plane pl-1" aria-hidden="true"></i>
                </button>
            </div>
        </form>
        </React.Fragment>
    )
}

export async function getServerSideProps(context){
    const cookie = parseCookies(context)
    const user = cookie.user ? JSON.parse(cookie.user):""
    if(user.role !== "admin"||user.role !== "root"){
        const {res} = context;
        res.writeHead(302,{Location:"/"})
        res.end()
    }
    return {
        props:{}
    }
}

export default Create