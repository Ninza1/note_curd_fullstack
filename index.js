import express from "express";
import dotenv  from "dotenv";
import connection from "./config/db.js"
import userRouter from "./routes/user.route.js";
import cors from  "cors"
import noteRouter from "./routes/note.route.js";
import auth from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ||8080
app.use(express.json())
app.use(cors({origin:"*"}));
app.use("/api/user", userRouter)
app.use("/api/notes", auth, noteRouter)




app.listen(PORT, async() =>{
    try{
        await connection
        console.log(`Server is running on port ${PORT} && db connected successfully`)

    }catch(err){
        console.log(`Err occurd while running servr or db connection ${err}`)
    }
})