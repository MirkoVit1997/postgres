import { Request, Response, NextFunction } from "express";
import passport from "passport";

function authorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (!user || err) {
      res.status(401).json({ msg: "Unauthorized." });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
}

export default authorize