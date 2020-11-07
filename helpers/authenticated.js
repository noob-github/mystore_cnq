import jwt from "jsonwebtoken";

function Authenticated(component) {
  return (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).json({ error: "You must be logged in" });
    }
    try {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
      req.userId = userId;
      return component(req, res);
    } catch (err) {
      console.log("error in authenticated",err)
      return res.status(400).json({ error: "You must be logged in" });
    }
  };
}

export default Authenticated