import {useState,useEffect} from "react"
import {parseCookies} from 'nookies'
import baseUrl from "../helpers/baseUrl"

const UserRoles = () =>{
    const [users,setUsers] = useState([])
    const {token} = parseCookies()
    useEffect(async ()=>{
        const res = await fetch(`${baseUrl}/api/users`,{
            headers:{
                "Authorization":token
            }
        })
        const data = await res.json()
        console.log(data)
        setUsers(data)
    },[])

    const handleRole = async (_id,role) =>{
        const res = await fetch(`${baseUrl}/api/users`,{
            method:"PUT",
            headers:{
                "Authorization":token,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                _id,
                role,
            })
        })
        const data = await res.json()
        console.log(data)
        let updatedUserList = users.map(user=>{
            if(user._id===data._id){
                return data
            }
            else return user
        })
        setUsers(updatedUserList)
    }

    return (
        <>
        <h2> UserRoles</h2>
        <table className="table table-bordered">
            <thead className="thead-dark">
                <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((item,ind)=>{
                    return (
                        <tr key={ind}>
                            <td>{ind+1}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td onClick={()=>handleRole(item._id,item.role)}>{item.role}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}

export default UserRoles