import { Express, Request, Response } from "express";
import { createCategorytHandler, deleteCategoryHandler, getCategoriesHandler, updateCategoriesHandler } from "./controller/category.controller";
import { createOfferHandler, getAllOffersHandler, getOfferByIdHandler, updateOfferByIdHandler } from "./controller/offer.controller";
import { cancelOrderHandler, createOrdertHandler, getOrderByIdHandler, getOrdersByUserIdHandler, updateOrdertHandler } from "./controller/order.controller";
import { createProductHandler, deleteProductHandler, getProductByCategoryHandler, getProductByIdHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";
import { deleteSessionHandler, getUserSessionsHandler } from "./controller/sessionController";
import { adminLoginHandler, createOrGetUserHandler, getAllUsershandler, getUserByIdHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { createProductSchema, updateProductSchema, updateStockSchema } from "./schema/product.schema";

function routes(app: Express) {

    app.get("/healthcheck", (req: Request, res:Response) => {
        res.sendStatus(200)
    })

    //Users
    app.post("/api/users", createOrGetUserHandler) // create or get existing user with referesh token // login
    app.get("/api/admin/:id", adminLoginHandler) // create or get existing user with referesh token // login
    app.get("/api/users", getAllUsershandler)
    app.get("/api/users/:id", getUserByIdHandler)

    // Session
    app.get("/api/sessions", getUserSessionsHandler) // get active user sessions
    app.delete("/api/sessions",requireUser, deleteSessionHandler) // log out user

    // Products 
    app.post("/api/products",validateResource(createProductSchema), createProductHandler) // create products
    app.post("/api/products/:productId",validateResource(updateProductSchema), updateProductHandler) // update products
    app.post("/api/product/:productId",validateResource(updateStockSchema), updateProductHandler) // update stock
    app.get("/api/products", getProductHandler) // get all products
    app.get("/api/products/:productId", getProductByIdHandler) // get product by id
    app.get("/api/productsByCategory/:categoryId", getProductByCategoryHandler) // get product by category
    app.delete("/api/products/:productId", deleteProductHandler) // get product by category

    //Categories
    app.get("/api/categories", getCategoriesHandler)
    app.post("/api/categories", createCategorytHandler)
    app.post("/api/categories/:categoryId", updateCategoriesHandler)
    app.delete("/api/categories/:categoryId", deleteCategoryHandler)

    //orders
    app.post("/api/order", requireUser, createOrdertHandler) // create order
    app.post("/api/updateorder", requireUser, updateOrdertHandler) // update order
    app.get("/api/order", getOrdersByUserIdHandler) // get all user order
    app.get("/api/order/:orderId", requireUser, getOrderByIdHandler) // get order by id
    app.delete("/api/order/:orderId", requireUser, cancelOrderHandler) // cancel order
    

    //offers
    app.post("/api/offers", createOfferHandler)
    app.post("/api/offers/:offerId", updateOfferByIdHandler)
    app.get("/api/offers", getAllOffersHandler)
    app.get("/api/offers/:offerId", getOfferByIdHandler)


 }

export default routes