import { parseCookies } from "nookies";
import baseUrl from "../helpers/baseUrl";
import UserRoles from "../components/UserRoles";

const Profile = ({ orders }) => {
console.log(orders)
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : "";

  const showPanel = (i) => {
    let panelList = document.getElementsByClassName("panel");
    if (panelList[i].style.maxHeight) {
      panelList[i].style.maxHeight=null
    } else {
      panelList[i].style.maxHeight = panelList[i].scrollHeight + "px"
    }
  };

  const OrderHistory = () =>
    orders.map((eachOrder, ind) => {
      return (
        <div key={ind}>
      <button
        className="accordion"
        onClick={() => {
          showPanel(ind);
        }}
        >
        {eachOrder.createdAt}
      </button>
      <div className="panel">
          <h4>Total Rs {eachOrder.total}</h4>
            {eachOrder.products.map((eachProduct,ind)=>{
                return (<h5 key={ind}>{eachProduct.product.name} X {eachProduct.quantity}</h5>)
            })}
        </div>
        </div>
    );
  });
return (
  <>
    <center>
      <div className="d-flex justify-content-between flex-wrap">
      <h4>{user.name}</h4>
        <h4>{user.email}</h4>
        </div>
        {
          orders.length===0?(
            <h4>
            You have no order for now
          </h4>
          ):(
            <OrderHistory />
          )
        }
        {
          user.role==="root" && <UserRoles/>
        }
      </center>
    </>
  );
};

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  if (!token) {
    const { res } = context;
    res.writeHead(302, { Location: "/signin" });
    res.end();
  } else {
    const res = await fetch(`${baseUrl}/api/orders`, {
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();
    return {
      props: { orders: data },
    };
  }
}

export default Profile;
