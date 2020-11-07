import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {parseCookies} from "nookies"
import cookie from 'js-cookie'

const NavBar = () => {
  const [menu,setMenu] = useState(false)
  const router = useRouter();
  
  const cookieUser = parseCookies()
  const user = cookieUser.user ? JSON.parse(cookieUser.user):""
  console.log(user)

  function isActive(route) {
    if (route == "/"&&route==router.pathname) return "bg-danger";
    else if (route == router.pathname) return "bg-primary";
    else "";
  }

  const show = menu?"show":""

  return (
    <nav className="navbar navbar-expand-sm bg-info">
      <Link className="nav-item " href="/">
        <a className={`nav-link text-light mr-2 ${isActive("/")}`}>Logo</a>
      </Link>
      <button className="navbar-toggler" type="button" onClick={()=>setMenu(!menu)}>
      <i className="fa fa-bars menu-icon" aria-hidden="true"></i>
      </button>
      <div  className={`collapse navbar-collapse ${show}`} >
      <ul className="navbar-nav ml-auto">
        <Link className="nav-item" href="/cart"><a className={`nav-link text-light ${isActive('/cart')}`}>Cart</a></Link>
        { 
          (user.role==="admin"||user.role==="root")  &&         <Link className="nav-item" href="/create">
          <a className={`nav-link text-light ${isActive("/create")}`}>Create</a>
        </Link>
        }
        {
          user?(
            <>
            <Link className="nav-item" href="/profile">
            <a className={`nav-link text-light ${isActive("/profile")}`}>Profile</a>
          </Link>
          <button className="btn  btn-outline-danger" onClick={()=>{
            cookie.remove('token')
            cookie.remove("user")
            router.push('/signin')
          }}>Logout</button>
          </>
          ):(
            <>
            <Link className="nav-item" href="/signin">
            <a className={`nav-link text-light ${isActive("/signin")}`}>Signin</a>
          </Link>
          <Link className="nav-item" href="/signup">
            <a className={`nav-link text-light ${isActive("/signup")}`}>Signup</a>
          </Link>
          </>
          ) 
        }
      </ul>        
      </div>
    </nav>
  );
};

export default NavBar;
