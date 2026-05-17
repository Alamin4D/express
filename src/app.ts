import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req: Request, res: Response) => {
    // res.send('Hello World!')
    res.status(200).json({
        "message": "Express server",
        "author": "Next Level",
    })
})

app.use("/users", userRoute)
app.use("/profiles", profileRoute)
app.use("/auth", authRoute)



export default app;
