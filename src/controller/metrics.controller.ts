import { Request, Response } from "express";
import {
    getAllOffers,
    getBestSellingProducts,
    getOrderMetrics,
    getProductCount,
    getTopCustomers,
    getTotalRevenue,
    getUserCount
} from "../service/metric.service";

export async function getMetricsHandler(req: Request, res: Response) {
    try {
        // Extract startDate and endDate from query parameters
        const { stDate, edDate } = req.query;

        // If dates are provided, ensure they're in the correct format
        const start = stDate ? String(stDate) : undefined;
        const end = edDate ? String(edDate) : undefined;

        // If not cached, fetch metrics from the database
        const userCount = await getUserCount(start, end);
        const productCount = await getProductCount(start, end);
        const orderMetrics = await getOrderMetrics(start, end);
        const offer = await getAllOffers(); // Assuming offers don't need date filtering
        const totalRevenue = await getTotalRevenue(start, end);
        const bestSelling = await getBestSellingProducts(start, end);
        const topCustomers = await getTopCustomers(start, end);

        const metrics = {
            users: userCount,
            products: productCount,
            orders: orderMetrics,
            Offers: offer,
            totalRevenue: totalRevenue,
            bestSelling: bestSelling,
            topCustomers: topCustomers,
        };

        // Store metrics in Redis cache with expiration time of 5 minutes (300 seconds)
        // await setAsync("metrics", JSON.stringify(metrics), "EX", 300);

        // Return the fresh metrics
        return res.status(200).send({ status: 200, metrics });
    } catch (error: any) {
        return res.status(500).send({ status: 500, message: "Error fetching metrics", error: error.message });
    }
}
