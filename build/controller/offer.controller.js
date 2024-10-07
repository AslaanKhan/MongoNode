"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOfferHandler = createOfferHandler;
exports.getAllOffersHandler = getAllOffersHandler;
exports.getOfferByIdHandler = getOfferByIdHandler;
exports.updateOfferByIdHandler = updateOfferByIdHandler;
exports.deleteCategoryHandler = deleteCategoryHandler;
const user_model_1 = __importDefault(require("../models/user.model"));
const category_service_1 = require("../service/category.service");
const offer_service_1 = require("../service/offer.service");
async function createOfferHandler(req, res) {
    const body = req.body;
    const user = await user_model_1.default.findOne({ _id: res?.locals?.user?._doc?._id });
    // if (!user?.isAdmin) {
    //     return res.send({ status: 200, message: "Only admin can create category" })
    // }
    try {
        const offer = await (0, offer_service_1.createOfferAndUpdateProducts)(body); // Using the updated service
        return res.send({ status: "200", message: "Offer created", offer });
    }
    catch (error) {
        return res.status(500).send({ status: "500", message: "Error creating offer", error: error.message });
    }
}
async function getAllOffersHandler(req, res) {
    const offers = await (0, offer_service_1.getAllOffers)();
    return res.send({ status: "200", offers });
}
async function getOfferByIdHandler(req, res) {
    const Id = req.params.offerId;
    const offer = await (0, offer_service_1.getOfferById)(Id);
    return res.send({ status: "200", offer });
}
async function updateOfferByIdHandler(req, res) {
    const user = await user_model_1.default.findOne({ _id: res?.locals.user?._doc?._id });
    const offerId = req.params.offerId;
    const updateData = req.body;
    // Check if the offer exists
    const offerExist = await (0, offer_service_1.getOfferById)(offerId);
    if (!offerExist) {
        return res.status(404).send({ message: "Offer not found" });
    }
    try {
        // Call the updated service to handle the offer update and product updates
        const updatedOffer = await (0, offer_service_1.updateOfferAndUpdateProducts)(offerId, updateData);
        return res.send({ status: "200", message: "Offer Updated", offer: updatedOffer });
    }
    catch (error) {
        return res.status(500).send({ status: "500", message: "Error updating offer", error: error.message });
    }
}
async function deleteCategoryHandler(req, res) {
    const categoryId = req.params.categoryId;
    await (0, category_service_1.deleteCategory)({ _id: categoryId });
    return res.send({ status: "200", message: "Category deleted" });
}
