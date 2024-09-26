import { Express, Request, Response } from "express";
import { cancelOrderHandler, createOrdertHandler, getOrderByIdHandler, getOrdersByUserIdHandler, updateOrdertHandler } from "./controller/order.controller";
import { createProductHandler, getProductByIdHandler, getProductHandler } from "./controller/product.controller";
import { deleteSessionHandler, getUserSessionsHandler } from "./controller/sessionController";
import { createOrGetUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";

function routes(app: Express) {

    app.get("/healthcheck", (req: Request, res:Response) => {
        res.sendStatus(200)
    })

    //Users
    app.post("/api/users", createOrGetUserHandler) // create or get existing user with referesh token // login

    // Session
    app.get("/api/sessions", getUserSessionsHandler) // get active user sessions
    app.delete("/api/sessions",requireUser, deleteSessionHandler) // log out user

    // Products 
    app.post("/api/products", requireUser, createProductHandler) // create products
    app.get("/api/products", getProductHandler) // get all products
    app.get("/api/products/:productId", getProductByIdHandler) // get product by id

    //Categories


    //orders
    app.post("/api/order", requireUser, createOrdertHandler) // create order
    app.post("/api/updateorder", requireUser, updateOrdertHandler) // update order
    app.get("/api/order", requireUser, getOrdersByUserIdHandler) // get all user order
    app.get("/api/order/:orderId", requireUser, getOrderByIdHandler) // get order by id
    app.delete("/api/order/:orderId", requireUser, cancelOrderHandler) // cancel order
    

    //


 }

export default routes