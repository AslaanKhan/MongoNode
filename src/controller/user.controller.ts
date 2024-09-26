import { Request, Response } from "express";
import { CreateUserInput, createUserSchema } from "../schema/user.schema";
import { createUser, getUser } from "../service/user.service";
import logger from "../utils/logger";
import validateResource from "../middleware/validateResource";
import { createSession } from "../service/sessionService";
import { createUserSessionHandler } from "./sessionController";
import UserModel from "../models/user.model";

export async function createOrGetUserHandler(req:Request<{}, {}, CreateUserInput["body"]>, res:Response) {
    try {
        const { number, name } = req.body;
        let existingUser;
        
        if(number){
            existingUser = await getUser({number});
        }else if(name){
            existingUser = await getUser({number});
        }
        
        if(existingUser) {            
            const token = await createUserSessionHandler(req, res);
            return res.send({status: 200, message:'User logged in', token: token});
        };

        validateResource(createUserSchema)(req, res, async () => {
            // Create a new user
            await createUser(req.body);
            const token = await createUserSessionHandler(req, res);
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