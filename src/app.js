import express  from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.js";
import postsRouter from "./src/routes/posts.js";
import usuariosRouter from "./src/routes/usuarios.js";

const app  = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/usuarios", usuariosRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`http://localhost:${port}/`);
});