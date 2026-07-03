import "dotenv/config";
import express  from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";

const app  = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/publicaciones", postsRouter);
app.use("/api/usuarios", usersRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`http://localhost:${port}/api`);
});
