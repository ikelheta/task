import express from "express"
import 'dotenv/config'
import { connect } from "mongoose"
import cors from "cors"
const app = express()
app.use(express.json());
app.use(cors())







const PORT = process.env.PORT || 3000

const start = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI || "")
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();