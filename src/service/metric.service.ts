import UserModel from "../models/user.model";
import ProductModel from "../models/product.model";
import OrderModel from "../models/order.model";
import OfferModel from "../models/offer.model";

export async function getUserCount(startDate?: string, endDate?: string) {
    const matchCriteria: any = {};
    
    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    return UserModel.countDocuments(matchCriteria).exec();
}

export async function getProductCount(startDate?: string, endDate?: string) {
    const matchCriteria: any = {};
    
    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    return ProductModel.countDocuments(matchCriteria).exec();
}

export async function getOrderMetrics(startDate?: string, endDate?: string) {
    const matchCriteria: any = {};

    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const totalOrders = await OrderModel.countDocuments(matchCriteria).exec();
    const completedOrders = await OrderModel.countDocuments({ ...matchCriteria, orderStatus: "completed" }).exec();
    const pendingOrders = await OrderModel.countDocuments({ ...matchCriteria, orderStatus: "pending" }).exec();
    const canceledOrders = await OrderModel.countDocuments({ ...matchCriteria, orderStatus: "canceled" }).exec();

    return {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        canceled: canceledOrders,
    };
}

export async function getAllOffers(startDate?: string, endDate?: string) {
    const matchCriteria: any = {};
    
    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    const offers = await OfferModel.aggregate([
        { $match: matchCriteria },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$code" },
                isActive: { $first: "$isActive" },
            },
        },
    ]).exec();
    return offers;
}

export async function getTotalRevenue(startDate?: string, endDate?: string) {
    const matchCriteria: any = {
        orderStatus: "completed",
    };

    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const orders = await OrderModel.find(matchCriteria).exec();
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    // Store in Redis
    // await redisClient.setEx("totalRevenue", 3600, JSON.stringify({ status: 200, totalRevenue }));

    return totalRevenue;
}

export async function getBestSellingProducts(startDate?: string, endDate?: string) {
    const matchCriteria: any = {
        orderStatus: "completed",
    };

    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const bestSelling = await OrderModel.aggregate([
        { $match: matchCriteria },
        { $unwind: "$products" },
        {
            $lookup: {
                from: "products",
                localField: "products.id",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$products.id",
                name: { $first: "$productDetails.title" },
                totalSold: { $sum: "$products.quantity" },
                revenue: { $sum: { $multiply: ["$productDetails.price", "$products.quantity"] } },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
            $project: { _id: 1, name: 1, totalSold: 1, revenue: 1 }, // Limit projection
        },
    ]).exec();

    return bestSelling;
}

export async function getTopCustomers(startDate?: string, endDate?: string) {
    const matchCriteria: any = {
        orderStatus: "completed",
    };

    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const topCustomers = await OrderModel.aggregate([
        { $match: matchCriteria },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$user",
                name: { $first: "$userDetails.name" },
                totalSpent: { $sum: "$amount" },
                totalOrders: { $sum: 1 },
            },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
    ]).exec();

    return topCustomers;
}
