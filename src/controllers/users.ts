import { Request, Response } from "express";
import { db } from "../db.js";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function signuUp(req: Request, res: Response) {
  const { username, password } = req.body;
  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE username=$1`,
    username
  );

  if (user) {
    res.status(409).json({ msg: "Username already in use" });
  } else {
    await db.none(`INSERT INTO users (username, password) VALUES ($1, $2)`, [
      username,
      password,
    ]);
    res.status(200).json({ msg: "Signup successful. Now you can log in." });
  }
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE username=$1`,
    username
  );

  if (user && password === user.password) {
    const payload = {
      id: user.id,
      username,
    };
    const { SECRET = "" } = process.env;
    const token = jwt.sign(payload, SECRET);

    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [payload.id, token]);
    res.status(200).json({ id: user.id, username, token });
  }
}

export async function logOut(req: Request, res: Response) {
  const user: any = req.user;
  await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, null]);
  res.status(200).json({ msg: "User successfully logged out." });
}
