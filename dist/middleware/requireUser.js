"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireUser = (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        return res.send({ status: 200, message: "Please login to continue" });
    }
    return next();
};
exports.default = requireUser;
