import { useRouter } from "next/router";
import baseUrl from "../../helpers/baseUrl";
import React, { useState } from "react";
import { parseCookies } from "nookies";

let openModal = () => {
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
};

const Product = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const cookie = parseCookies();
  const user = cookie.user ? JSON.parse(cookie.user) : "";

  let deleteProduct = async (product) => {
    const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data.message);
    router.push("/");
  };

  let addToCart = async () => {
    const res = await fetch(`${baseUrl}/api/cart`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":cookie.token
      },
      body:JSON.stringify({
        quantity:quantity,
        productId:product._id
      })
    })
    const data = await res.json()
    console.log(data)
  };

  if (router.isFallback) {
    return <h3>Loading</h3>;
  } else
    return (
      <React.Fragment>
        {/* <!-- The Modal --> */}
        <div id="myModal" className="modal">
          {/* <!-- Modal content --> */}
          <div className="modal-content">
            <span className="close">&times;</span>
            <div>
              <h4 className="bd-highlight">
                Are you sure you want to delete product ?
              </h4>
            </div>
            <div className="d-flex flex-row-reverse">
              <button className="btn">No</button>
              <button
                className="btn btn-danger"
                onClick={() => deleteProduct(product)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
        {/* -------------------*/}

        <section id="product-detail">
          <hr />
          <div className="row">
            <h1 className="mx-auto">{product.name}</h1>
          </div>
          <div className="row">
            <img className="mx-auto w-50" src={product.mediaUrl} />
          </div>
          <div className="row">
            <h5 className="mx-auto mt-2">Rs {product.price}</h5>
          </div>
          <hr />
          <div className="row form-group ">
            <input
              className="form-control mx-auto col-sm-8 col-7"
              name="quantity"
              id="user-quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter Quantity"
              min="1"
            />
            {user ? (
              <div className="col-sm-4 col-5">
                <button
                  className="btn btn-primary mx-auto"
                  onClick={() => {
                    addToCart();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="col-sm-4 col-5">
                <button
                  className="btn btn-primary mx-auto"
                  onClick={() => {
                    router.push("/signin");
                  }}
                >
                  Login To Add
                </button>
              </div>
            )}
          </div>
          <hr />
          <div className="row text-center">
            <p>{product.description}</p>
          </div>
          {user.role === "admin" &&
            user.role ===
              "root"(
                <div className="row">
                  <button
                    className="btn btn-danger mx-auto"
                    id="myBtn"
                    onClick={openModal}
                  >
                    {" "}
                    Delete
                  </button>
                </div>
              )}
        </section>
      </React.Fragment>
    );
};


 export async function getServerSideProps(context){
    console.log("context.params  ",context.params)
    const id = context.params.productId
    const res = await fetch(`http://localhost:3000/api/product/${id}`)
    const data = await res.json()
    return {
        props:{product:data}
    }
} 


// export async function getStaticProps(context) {
//   console.log("context.params  ", context.params);
//   const id = context.params.productId;
//   const res = await fetch(`${baseUrl}/api/product/${id}`);
//   const data = await res.json();
//   return {
//     props: { product: data },
//   };
// }

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { productId: "5f9e4cd91d1b8f3fdd86603a" } }],
//     fallback: true,
//   };
// }
export default Product;
