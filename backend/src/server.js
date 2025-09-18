import express from "express"
import authRoute from "./routes/auth.route.js";
import propertyRoute from "./routes/property.route.js"
import cookieParser from "cookie-parser";
import transactionRoute from "./routes/transaction.route.js"
import networkRoute from "./routes/network.route.js"

import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());




app.get("/", (req, res) => {
  res.send("such a ranniy day it is")
  console.log("start is fine like a red wine");


})

app.use("/api/auth", authRoute);
app.use("/api/properties", propertyRoute);
app.use('/api/transactions', transactionRoute)
app.use('/api/network', networkRoute)

app.listen(PORT, () => {
  console.log(`server is runnning on the port ${PORT}`)
  connectDb();

})

