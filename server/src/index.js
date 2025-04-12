import dotenv from "dotenv"
import {app} from "./app.js"
import connectDb from "./db/index.db.js";
import { defaultUser } from "./utils/defaultUser.js";

dotenv. config({
    path: './.env'
})

connectDb()
.then(async ()=>{
    app.listen(process.env.PORT || 4000 ,()=>{
        console.log(`Server is listening on port: ${process.env.PORT}`);
    })
    await defaultUser();
})
.catch((err)=>{
    console.log("MongoDb Connection Error");
})