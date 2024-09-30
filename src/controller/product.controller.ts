import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { CreateProductInput, UpdateProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, getAllProducts, getProduct, getProductByCategory, updateProduct } from "../service/product.service";

export async function createProductHandler(req: Request<{}, {}, CreateProductInput["body"]>, res:Response) { 
    const body = req.body
    const user = await UserModel.findOne({_id: res?.locals?.user?._doc?._id})
    // if(!user?.isAdmin){
    //     return res.send({ status:200, message:"User not admin" })
    // }
    try {
        const product = await createProduct(body)
        return res.send({status:"200", message:"Product Created", product}) 
    } catch (error) {
        return res.send({status:"200", message:"Something went wrong" , error})
    }
}

export async function updateProductHandler(req: Request<UpdateProductInput["params"], UpdateProductInput["body"]>, res:Response) {
    const user = await UserModel.findOne({_id: res?.locals.user?._doc?._id})
    const productId = req.params.productId
    const update = req.body    
    const productExist = await getProduct({_id:productId})
    
    if(!productExist){
        return res.sendStatus(404)
    }
    
    // if(!user?.isAdmin){
    //     return res.status(403).send({ message:"User not admin" })
    // }

    const product = await updateProduct({_id:productId}, update, { new: true })
    return res.send({status:'200', message:"Product Updated", product})
}

export async function getProductHandler(req: Request, res:Response) {
    const products = await getAllProducts()
    return res.send({ status:"200", products: products })
}

export async function getProductByIdHandler(req: Request, res:Response) {
    const productId = req.params.productId
    const products = await getProduct({_id:productId})
    return res.send({ status:"200", product: products })
}

export async function getProductByCategoryHandler(req: Request, res:Response) {
    const categoryId = req.params.categoryId
    const products = await getProductByCategory({ 'category.id': categoryId })
    return res.send({ status:"200", product: products })
}


export async function deleteProductHandler(req: Request, res:Response) {
    const user = await UserModel.findOne({_id: res?.locals?.user?._doc?._id})
    const productId = req.params.productId
    const product = await getProduct({_id:productId})
    
    if(!product){
        return res.send({status:"200", message:"Product not found"})
    }
    
    // if(!user?.isAdmin){
    //     return res.status(403).send({ message:"User not admin" })
    // }

    await deleteProduct({_id: productId})
    return res.send({status:"200", message:"Product deleted "})
}