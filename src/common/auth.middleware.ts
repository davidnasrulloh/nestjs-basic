import { Injectable, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Request } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private prismaServie: PrismaService){

    }

    async use(req: any, res: any, next: (error?: any) => void) {
        const token = req.headers['authorization'] as string;
        if(token){
            const user = await this.prismaServie.user.findFirst({
                where: {
                    token: token
                }
            })

            if(user){
                req.user = user
            }
        }

        next()
    }
    
}