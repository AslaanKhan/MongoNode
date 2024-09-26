import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.send({status: 200, message: "Please login to continue"});
  }

  return next();
};

export default requireUser;