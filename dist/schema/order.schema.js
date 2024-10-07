"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        products: (0, zod_1.array)((0, zod_1.object)({
            id: (0, zod_1.string)(),
            quantity: (0, zod_1.number)()
        })),
        amount: (0, zod_1.number)(),
        paymentMode: (0, zod_1.string)({
            required_error: "Payment mode is required"
        }),
        paymentId: (0, zod_1.string)(),
        paymentStatus: (0, zod_1.string)(),
        paymentResult: (0, zod_1.string)(),
        orderStatus: (0, zod_1.string)(),
    })
};
const updatePayload = {
    body: (0, zod_1.object)({
        products: (0, zod_1.array)((0, zod_1.object)({
            id: (0, zod_1.string)(),
            quantity: (0, zod_1.number)()
        })),
        amount: (0, zod_1.number)(),
        paymentId: (0, zod_1.string)(),
        paymentStatus: (0, zod_1.string)(),
        paymentResult: (0, zod_1.string)(),
        orderStatus: (0, zod_1.string)(),
    })
};
const params = {
    params: (0, zod_1.object)({
        orderId: (0, zod_1.string)({
            required_error: "orderId is required"
        })
    })
};
exports.createOrderSchema = (0, zod_1.object)({
    ...payload
});
exports.updateOrderSchema = (0, zod_1.object)({
    ...updatePayload,
    ...params
});
