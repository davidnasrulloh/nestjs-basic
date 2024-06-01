import { Injectable, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Request } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private prismaServie: PrismaService){

    }

    async use(req: any, res: any, next: (error?: any) => void) {
        const token:any = req.headers['authorization'] as string;
        console.log('itemku token', token)
        if(token){
            const user = await this.prismaServie.user.findFirst({
                where: {
                    token: token.split(' ')[1]
                }
            })
            // console.log('itemku user :', token.split(' ')[1], user)

            if(user){
                req.user = user
            }
        }

        next()
    }
    
}