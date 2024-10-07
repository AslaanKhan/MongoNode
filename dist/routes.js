"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_controller_1 = require("./controller/category.controller");
const offer_controller_1 = require("./controller/offer.controller");
const order_controller_1 = require("./controller/order.controller");
const product_controller_1 = require("./controller/product.controller");
const sessionController_1 = require("./controller/sessionController");
const user_controller_1 = require("./controller/user.controller");
const requireUser_1 = __importDefault(require("./middleware/requireUser"));
const validateResource_1 = __importDefault(require("./middleware/validateResource"));
const product_schema_1 = require("./schema/product.schema");
function routes(app) {
    app.get("/healthcheck", (req, res) => {
        res.sendStatus(200);
    });
    //Users
    app.post("/api/users", user_controller_1.createOrGetUserHandler); // create or get existing user with referesh token // login
    app.get("/api/admin/:id", user_controller_1.adminLoginHandler); // create or get existing user with referesh token // login
    app.get("/api/users", user_controller_1.getAllUsershandler);
    app.get("/api/users/:id", user_controller_1.getUserByIdHandler);
    // Session
    app.get("/api/sessions", sessionController_1.getUserSessionsHandler); // get active user sessions
    app.delete("/api/sessions", requireUser_1.default, sessionController_1.deleteSessionHandler); // log out user
    // Products 
    app.post("/api/products", (0, validateResource_1.default)(product_schema_1.createProductSchema), product_controller_1.createProductHandler); // create products
    app.post("/api/products/:productId", (0, validateResource_1.default)(product_schema_1.updateProductSchema), product_controller_1.updateProductHandler); // update products
    app.post("/api/product/:productId", (0, validateResource_1.default)(product_schema_1.updateStockSchema), product_controller_1.updateProductHandler); // update stock
    app.get("/api/products", product_controller_1.getProductHandler); // get all products
    app.get("/api/products/:productId", product_controller_1.getProductByIdHandler); // get product by id
    app.get("/api/productsByCategory/:categoryId", product_controller_1.getProductByCategoryHandler); // get product by category
    app.delete("/api/products/:productId", product_controller_1.deleteProductHandler); // get product by category
    //Categories
    app.get("/api/categories", category_controller_1.getCategoriesHandler);
    app.post("/api/categories", category_controller_1.createCategorytHandler);
    app.post("/api/categories/:categoryId", category_controller_1.updateCategoriesHandler);
    app.delete("/api/categories/:categoryId", category_controller_1.deleteCategoryHandler);
    //orders
    app.post("/api/order", requireUser_1.default, order_controller_1.createOrdertHandler); // create order
    app.post("/api/updateorder", requireUser_1.default, order_controller_1.updateOrdertHandler); // update order
    app.get("/api/order", order_controller_1.getOrdersByUserIdHandler); // get all user order
    app.get("/api/order/:orderId", requireUser_1.default, order_controller_1.getOrderByIdHandler); // get order by id
    app.delete("/api/order/:orderId", requireUser_1.default, order_controller_1.cancelOrderHandler); // cancel order
    //offers
    app.post("/api/offers", offer_controller_1.createOfferHandler);
    app.post("/api/offers/:offerId", offer_controller_1.updateOfferByIdHandler);
    app.get("/api/offers", offer_controller_1.getAllOffersHandler);
    app.get("/api/offers/:offerId", offer_controller_1.getOfferByIdHandler);
}
exports.default = routes;
