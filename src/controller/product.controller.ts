import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { CreateProductInput, UpdateProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../service/product.service";

export async function createProductHandler(req: Request<{}, {}, CreateProductInput["body"]>, res:Response) { 
    const body = req.body
    const user = await UserModel.findOne({_id: res.locals.user._doc._id})
    if(!user?.isAdmin){
        return res.send({ status:200, message:"User not admin" })
    }
    
    await createProduct(body)
    return res.send({status:"200", message:"Product Created"}) 
}

export async function updateProductHandler(req: Request<UpdateProductInput["params"], UpdateProductInput["body"]>, res:Response) {
    const user = await UserModel.findOne({_id: res.locals.user._doc._id})
    const productId = req.params.productId
    const update = req.body    
    const product = await getProduct({productId})
    
    if(!product){
        return res.sendStatus(404)
    }
    
    if(!user?.isAdmin){
        return res.status(403).send({ message:"User not admin" })
    }

    await updateProduct({productId}, update, { new: true })
    return res.send({status:'200', message:"Product Updated"})
}

export async function getProductHandler(req: Request, res:Response) {
    const products = await getAllProducts()
    return res.send({ status:"200", products: products })
}

export async function getProductByIdHandler(req: Request, res:Response) {
    const productId = req.params.productId
    const products = await getProduct({productId})
    return res.send({ status:"200", product: products })
}

export async function deleteProductHandler(req: Request, res:Response) {
    const user = await UserModel.findOne({_id: res.locals.user._doc._id})
    const productId = req.params.productId
    const product = await getProduct({productId})
    
    if(!product){
        return res.sendStatus(404)
    }
    
    if(!user?.isAdmin){
        return res.status(403).send({ message:"User not admin" })
    }

    await deleteProduct({productId})
    return res.send({status:"200", message:"Product deleted "})
}