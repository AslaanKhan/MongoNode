import { Request, Response } from "express";
import validateResource from "../middleware/validateResource";
import UserModel from "../models/user.model";
import { CreateUserInput, createUserSchema } from "../schema/user.schema";
import { createUser, getUserByParam } from "../service/user.service";
import logger from "../utils/logger";
import { createUserSessionHandler } from "./sessionController";

export async function createOrGetUserHandler(req:Request<{}, {}, CreateUserInput["body"]>, res:Response) {
    try {
        const { number, name } = req.body;
        let existingUser;
        
        if(number){
            existingUser = await getUserByParam({number});
        }else if(name){
            existingUser = await getUserByParam({number});
        }
        
        if(existingUser) {            
            const token = await createUserSessionHandler(req, res, existingUser);
            return res.send({status: 200, message:'User logged in', token: token});
        };

        validateResource(createUserSchema)(req, res, async () => {
            // Create a new user
            const user = await createUser(req.body);
            const token = await createUserSessionHandler(req, res, user);
            return res.send({ status: 200, message: 'User created successfully', token: token });
        });
    } catch (error:any) {
        logger.error(error);
        return res.status(409).send(error.message);
    }
}

export async function getAllUsershandler(req:Request, res:Response) {
    try {
        const users = await UserModel.find({});
    
        // setTimeout(() => {
        //   return res.send({ status: 200, users });
        // }, 60000);
        return res.send({ status: 200, users });
      } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send({ status: 500, message: 'Internal Server Error' });
      }
}

export async function getUserByIdHandler(req:Request, res:Response) {
    try {
        const { id } = req.params
        const user = await getUserByParam({_id:id});
    
        // setTimeout(() => {
        //   return res.send({ status: 200, users });
        // }, 60000);
        return res.send({ status: 200, user });
      } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send({ status: 500, message: 'Internal Server Error' });
      }
    }

export async function adminLoginHandler(req:Request, res:Response) {
    try {
        const { id } = req.params
        const user = await getUserByParam({ number : id});
        
        if(user?.isAdmin){
            const token = await createUserSessionHandler(req, res, user);
            return res.send({status: 200, message:'User logged in', token: token});
        }
        return res.send({ status: 201, message: 'User not admin' });
        // setTimeout(() => {
        //   return res.send({ status: 200, users });
        // }, 60000);
      } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send({ status: 500, message: 'Internal Server Error' });
      }
    }