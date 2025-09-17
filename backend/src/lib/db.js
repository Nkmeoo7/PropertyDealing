import mongoose from "mongoose";


export const connectDb = async () => {
  try {

    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`taking a sip of tea with database ${connection.connection.host}`);


  } catch (e) {

    console.log("database to connect kr lete", e);

  }
}

