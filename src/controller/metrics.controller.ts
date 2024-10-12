import { Request, Response } from "express";
import {
    getAllOffers,
    getBestSellingProducts,
    getOrderMetrics,
    getProductCount,
    getProductDataByDateRange,
    getTopCustomers,
    getTotalRevenue,
    getUserCount,
    getUserDataByDateRange
} from "../service/metric.service";

export async function getMetricsHandler(req: Request, res: Response) {
    try {
        const { stDate, edDate } = req.query;
        const start = stDate ? String(stDate) : undefined;
        const end = edDate ? String(edDate) : undefined;

        // Check if data is cached
        // const cachedMetrics = await RedisClient.get("metrics");
        // if (cachedMetrics) {
        //     return res.status(200).send({ status: 200, metrics: JSON.parse(cachedMetrics) });
        // }

        // Fetch metrics concurrently
        const [userCount, productCount, orderMetrics, offer, totalRevenue, bestSelling, topCustomers, userMetricsByDate, productMetricsByDate] = await Promise.all([
            getUserCount(start, end),
            getProductCount(start, end),
            getOrderMetrics(start, end),
            getAllOffers(),
            getTotalRevenue(start, end),
            getBestSellingProducts(start, end),
            getTopCustomers(start, end),
            getUserDataByDateRange(start, end),
            getProductDataByDateRange(start, end),
        ]);

        const metrics = {
            users: userCount,
            products: productCount,
            orders: orderMetrics,
            Offers: offer,
            totalRevenue,
            bestSelling,
            topCustomers,
            userMetricsByDate,
            productMetricsByDate
        };

        // Store in Redis with expiration of 5 minutes
        // await RedisClient.setEx("metrics", 300, JSON.stringify(metrics));

        return res.status(200).send({ status: 200, metrics });
    } catch (error: any) {
        return res.status(500).send({ status: 500, message: "Error fetching metrics", error: error.message });
    }
}