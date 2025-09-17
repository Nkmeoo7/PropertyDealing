import bcrypt from "bcryptjs";
import { generatetoken } from "../lib/jwt.token.js";
import User from "../models/user.model.js";



export const signup = async (req, res) => {

  const { fullName, password, phoneNumber } = req.body;

  try {
    if (!fullName || !password || !phoneNumber) {
      return res.status(400).json({
        message: "Please fill the required fields",

      })
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password lenght must be greater than 8 digit",

      })
    }

    const user = await User.findOne({ phoneNumber });
    if (user) return res.status(400).json({
      message: "The User is already registered with this Number",

    })


    //password salting (hashing basically);

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt)


    const newUser = new User({
      fullName,
      password: hashedpassword,
      phoneNumber,

    })

    if (newUser) {
      await newUser.save();

      generatetoken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,


      })
    } else {
      return res.status(400).json({
        message: "invalid user data",
      })
    }


  } catch (error) {
    console.log("failed the signUp controller", error);

    return res.status(500).json({
      message: "Internal server error please try agian later"
    })
  }





}





export const signin = async (req, res) => {
  const { phoneNumber, password } = req.body
  try {
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "please fill all the details" });
    }
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        message: "Invalid details please remember correctly"
      })
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(400).json({
        message: "Invalid details please remember correctly"
      })
    }
    generatetoken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,

    })


  } catch (error) {
    console.log("you know what you failed at login route")
    res.status(400).json({
      message: "Internal Server Error"
    })


  }




}

export const logout = (req, res) => {
  try {

    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({
      message: "Logged out successfully"
    })
  } catch (error) {
    console.log("you failed at logging out come on")
    res.status(500).json({ message: "Internal server Error" })

  }
}
