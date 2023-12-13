import { HttpException, HttpStatus, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken'

export class AuthMiddle implements NestMiddleware{
    use(req: any, res: Response, next: NextFunction) {
        // 获取token
        const token = req.headers.authorization
        // console.log(req.headers);
        
        // console.log(token);
        try {
         const currentUser =  jwt.verify(token, 'linfeng')
         req.currentUser = currentUser
        next()
        } catch (error) {
            // console.log(error);
            
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
        }

    }
}