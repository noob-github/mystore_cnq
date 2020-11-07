import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'
import React,{useState} from 'react'
import {useRouter} from 'next/router'
import cookie from "js-cookie"
const Signin = () =>{
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const router = useRouter()
    let handleSubmit=async (e)=>{
        e.preventDefault()
        const res = await fetch(`${baseUrl}/api/user/signin`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        let data = await res.json()
        if(data.error){
            console.log(data.error)
        }
        else{
            console.log(data)
            cookie.set("token",data.token)
            cookie.set("user",data.user)
            router.push('/')
        }
    }

    return(
        <React.Fragment>
            <h3 className="text-center">Signin</h3>
            <form  className="col-12 col-md-10 offset-md-1" onSubmit={(e)=>handleSubmit(e)}>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <div className="form-group mt-3">
                <center>
                <button className="btn btn-primary" type="submit">SignIn</button>
                <div>
                <Link href="/signup"><a>Don't have an account</a></Link>
                </div>
                </center>
            </div>
            </form>
        </React.Fragment>

    )
}

export default Signin