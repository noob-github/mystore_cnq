import Link from "next/link";
import baseUrl from "../helpers/baseUrl";

const Home = ({ products }) => {
  const ProductList = () =>
    products.map((product, ind) => {
      return (
        
          <div key={ind} className="card col-12 col-md-4 border-0">
            <img className="card-img-top" src={product.mediaUrl} />
            <div className="card-body row">
              <div className="card-title col-12 card-img-overlay text-light p-0 m-0">
                <h1 className="text-center">{product.name}</h1>
              </div>
              <div className="row col-12 ml-1">
                <p className="card-text col-7">Rs. {product.price}</p>
                <Link
                  href={`/product/[productId]`}
                  as={`/product/${product._id}`}
                  className="col-5"
                >
                  <a className="btn btn-primary">View Product</a>
                </Link>
              </div>
            </div>
          </div>

      );
    });
  // console.log(products)
  return (
    <div className="row justify-content-around mt-4">
      <ProductList />
    </div>
  );
};

export async function getStaticProps() {
  const response = await fetch(`${baseUrl}/api/products`);
  const data = await response.json();
  return {
    props: {
      products: data,
    },
  };
}

// export async function getServerSideProps () {
//   const response = await fetch(`${baseUrl}/api/products`);
//   const data = await response.json();
//   return {
//     props: {
//       products: data,
//     },
//   };
// }

export default Home;
