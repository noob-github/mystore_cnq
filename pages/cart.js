import baseUrl from "../helpers/baseUrl";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Cart = ({ error, products }) => {
  const { token } = parseCookies();
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState(products);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  let price = 0;

  if (!token) {
    return (
      <center>
        <button
          className="btn"
          onClick={() => {
            router.push("/signin");
          }}
        >
          <h3>Signin to view your cart</h3>
        </button>
      </center>
    );
  }

  if (error) {
    cookie.remove("user");
    cookie.remove("token");
    cookie.push("/login");
  }

  const handleRemove = async (pid) => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        productId: pid,
      }),
    });
    const data = await res.json();
    setCartProducts(data);
  };

  const openPayModal = async (price) => {
    let amount = price;
    amount = amount * 100;
    amount = Math.ceil(amount);
    let options = {
      key: "rzp_test_hGL6N8M5oGjVNF",
      amount: "",
      name: "My Store CNQ",
      order_id: "",
      handler: (response) => {
        console.log(response);
        fetch(`${baseUrl}/api/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            razorpay_signature: response.razorpay_signature,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            if(data.message==="ok"){
              setCartProducts([])
              router.push("/")
            }
          })
          .catch((err) => console.log("error is" + err));
      },
    };
    const res = await fetch(`${baseUrl}/api/payment`, {
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();
    console.log(data);
    options.amount = data.amount;
    options.order_id = data.id;
    // if(process.browser){
    let rzp1 = new window.Razorpay(options);
    rzp1.open();
    // }
  };

  const CartItems = () => {
    return (
      <>
        {cartProducts.map((item, ind) => {
          price = price + item.product.price * item.quantity;
          return (
            <div key={ind} className="row m-2 p-2 border">
              <img className="col-6 col-md-4" src={item.product.mediaUrl} />
              <div className="col-6 col-md-8">
                <h3>{item.product.name}</h3>
                <h5>
                  {item.quantity}X Rs.{item.product.price}
                </h5>
                <h6 className="d-none d-md-block">
                  {item.product.description}
                </h6>
                <button
                  className="btn btn-outline-danger mt-2"
                  onClick={() => handleRemove(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const TotalPrice = () => {
    return (
      <div>
        <center>
          <h5>total ₹ {price}</h5>
          <button
            className="btn btn-primary"
            onClick={() => openPayModal(price)}
          >
            Checkout
          </button>
        </center>
      </div>
    );
  };

  return (
    <>
      {cartProducts.length !== 0 ? (
        <>
          <CartItems />
          <TotalPrice />
        </>
      ) : (
        <div>
          <h2>Cart is empty</h2>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  if (!token) {
    return {
      props: { products: [] },
    };
  }
  const res = await fetch(`${baseUrl}/api/cart`, {
    headers: {
      Authorization: token,
    },
  });
  const products = await res.json();
  if (products.error) {
    return {
      props: { error: products.error },
    };
  }
  // console.log("products",products)
  return {
    props: { products },
  };
}

export default Cart;
