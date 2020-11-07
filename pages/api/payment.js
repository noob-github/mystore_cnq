import Authenticated from "../../helpers/authenticated";
import Cart from "../../models/Cart";
import Razorpay from "razorpay";
import Order from "../../models/Order";
import User from "../../models/User"
import product from "../../models/Product"
import initDB from "../../helpers/initDB";

initDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      console.log("order");
      await rzpOrder(req, res);
      break;
    case "POST":
      await rzpPayment(req, res);
      break;
  }
};
let price = 0;
let email, products;

const rzpOrder = Authenticated(async (req, res) => {
  // console.log("I am running")
  const cart = await Cart.findOne({ user: req.userId }).populate(
    "products.product"
  );
  cart.products.forEach((item) => {
    price = price + item.quantity * item.product.price;
  });
  console.log("price == ", price);
  let instance = new Razorpay({
    key_id: "rzp_test_hGL6N8M5oGjVNF",
    key_secret: "aLqp68YlksSJz8swKCUIKVkc",
  });
  let options = {
    amount: price * 100,
    currency: "INR",
    receipt: "order_rcptid_" + req.userId,
  };
  instance.orders.create(options, (err, order) => {
    console.log(order);
    res.json(order);
  });
});

const rzpPayment = Authenticated(async (req, res) => {
  const {
    razorpay_signature,
    razorpay_order_id,
    razorpay_payment_id,
  } = req.body;
  if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id)
    res.status(400).json({ error: "faliure in payment" });
  else {
    const cart = await Cart.findOne({ user: req.userId }).populate("user").populate("products.product");
    price = 0;
    cart.products.forEach((item) => {
      price = price + item.quantity * item.product.price;
    });
    await new Order({
      user:req.userId,
      email:cart.user.email,
      total:price,
      products:cart.products
    }).save()
    await Cart.findByIdAndUpdate({_id:cart._id},{$set:{products:[]}})
    res.json({ message: "ok" });
  }
});
