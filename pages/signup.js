import Link from 'next/link'
import React,{useState} from 'react'
import baseUrl from '../helpers/baseUrl'

const Signup = () =>{
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    let handleSubmit=async (e)=>{
        console.log(name,email,password);
        e.preventDefault();
        let res = await fetch(`${baseUrl}/api/user/signup`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password
            })
        })
        let data = await res.json();
        console.log(data);
        if(data.error){
            console.log("error in registring new user")
        }
        else console.log("user registered successfully")
    }

    return(
        <React.Fragment>
            <h3 className="text-center">Signup</h3>
            <form className="col-12 col-md-10 offset-md-1" onSubmit={(e)=>handleSubmit(e)}>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input className="form-control" type="text" name="name" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <div className="form-group mt-2">
                <center>
                <button className="btn btn-primary" type="submit">SignUp</button>
                <div>
                <Link href="/signin"><a>Already have an account</a></Link>
                </div>
                </center>
            </div>
            </form>
        </React.Fragment>

    )
}

export default Signup