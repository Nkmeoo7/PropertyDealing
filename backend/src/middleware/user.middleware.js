import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectedUser = async (req, res, next) => {

  const token = req.cookie.jwt;


  try {

    if (!token) {
      return res.status(401).json({
        message: "Token is not found && unouthrized access",
      })
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeToken.userId).select('-password');


    if (!req.user) {
      return res.status(401).json({
        message: "not authorized , user not found"
      })
    }

    next();

  } catch (e) {
    console.log("protectedUser is not there useroute is failed ", e);
    return res.status(400).json({
      message: "the user not protectedUser && invalid token"
    })



  }
}

export const authorize = (...roles) => {

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acesss denied Role '${req.user.role}' is not permitted`
      });

    }
    next();

  }
}







