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

export async function getUserDataByDateRange(startDate: string, endDate: string) {
    // Define the match criteria based on the provided dates
    const matchCriteria: any = {
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        },
    };

    // Calculate the difference in days between the two dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24); // Convert time difference to days

    let groupStage;

    // Determine aggregation method based on the date range
    if (dayDiff <= 30) { // For a month or less, use daily aggregation
        groupStage = {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        };
    } else if (dayDiff <= 365) { // For up to a year, use monthly aggregation
        groupStage = {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        };
    } else { // For more than a year, use yearly aggregation
        groupStage = {
            $group: {
                _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        };
    }

    try {
        // Perform aggregation to count users based on the specified date range
        const result = await UserModel.aggregate([
            { $match: matchCriteria },
            groupStage,
            { $sort: { _id: 1 } }, // Sort results by time period
        ]).exec();

        // Format result for x-axis and count
        const formattedResult = result.map(item => ({
            date: item._id, // This will be the x-axis label
            count: item.count // This will be the count for y-axis
        }));

        return formattedResult; // Return the formatted results
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw new Error("Could not fetch user data");
    }
}

export async function getProductDataByDateRange(startDate: string, endDate: string) {
    // Define the match criteria based on the provided dates
    const matchCriteria: any = {
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        },
        isAvailable: true,  // Only count available products
    };

    // Calculate the difference in days between the two dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24); // Convert time difference to days

    let groupStage;

    // Determine aggregation method based on the date range
    if (dayDiff <= 30) { // For a month or less, use daily aggregation
        groupStage = {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        };
    } else if (dayDiff <= 365) { // For up to a year, use monthly aggregation
        groupStage = {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        };
    } else { // For more than a year, use yearly aggregation
        groupStage = {
            $group: {
                _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        };
    }

    try {
        // Perform aggregation to count products based on the specified date range
        const result = await ProductModel.aggregate([
            { $match: matchCriteria },
            groupStage,
            { $sort: { _id: 1 } }, // Sort results by time period
        ]).exec();

        // Format result for x-axis and count
        const formattedResult = result.map(item => ({
            date: item._id, // This will be the x-axis label
            count: item.count // This will be the count for y-axis
        }));

        return formattedResult; // Return the formatted results
    } catch (error) {
        console.error("Error fetching product data:", error);
        throw new Error("Could not fetch product data");
    }
}


export async function getProductCount(startDate?: string, endDate?: string) {
    const matchCriteria: any = {};
    
    if (startDate && endDate) {
        matchCriteria.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }
    matchCriteria.isAvailable = true
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
