import Cart from "../../models/Cart";
import Authenticated from "../../helpers/authenticated";
import initDb from '../../helpers/initDB'

initDb()

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await fetchUserCart(req, res);
      break;
    case "PUT":
      await addProduct(req, res);
      break;
    case "DELETE":
      await removeProduct(req, res);
      break;
  }
};

const fetchUserCart = Authenticated(async (req, res) => {
  const cart = await Cart.findOne({ user: req.userId }).populate(
    "products.product"
  );
  res.status(200).json(cart.products);
});

const addProduct = Authenticated(async (req, res) => {
  const { quantity, productId } = req.body;
  await Cart.findOne({ user: req.userId });

  const foundUserCart = await Cart.findOne({ user: req.userId });
  const foundProduct = foundUserCart.products.some(
    (pdoc) => productId === pdoc.product.toString()
  );
  if (foundProduct) {
    await Cart.findOneAndUpdate(
      { _id: foundUserCart._id, "products.product": productId.toString() },
      { $inc: { "products.$.quantity": quantity } }
    );
  } else {
    const newProduct = { quantity, product: productId };
    await Cart.findOneAndUpdate(
      { _id: foundUserCart._id },
      { $push: { products: newProduct } }
    );
  }
  res.json({ message: "product added to cart" });
});

const removeProduct = Authenticated(async (req, res) => {
  const { productId } = req.body;
  const updatedCart = await Cart.findOneAndUpdate(
    { user: req.userId },
    { $pull: { products: { product: productId } } },
    { new: true }
  ).populate("products.product");
  res.json(updatedCart.products);
});
