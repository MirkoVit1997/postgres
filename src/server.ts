import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "../controllers/planets.js";
import multer from "multer";
import fs from "fs";
import { login, logOut, signuUp } from "./controllers/users.js";
import authorize from "./authorize.js";
import "./passport.js";

const app = express();
dotenv.config();
const port = process.env.PORT_NUMBER_SERVER;

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.post(
  "/api/planets/:id/image",
  upload.single("image"),
  authorize,
  createImage
);

app.post("/api/users/signup", signuUp);
app.post("/api/users/login", login);
app.get("/api/users/logout", authorize, logOut);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
