import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { RegisterUserRequest, UserResponse } from "../model/user.model";
import { Logger } from 'winston'
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt'
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ){}

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`Register new user ${JSON.stringify(request)}`)
        const registerReq : RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request)

        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                username: registerReq.username,
            }
        })

        if(totalUserWithSameUsername != 0){
            throw new HttpException('Username already exist', 400)
        } 

        registerReq.password = await bcrypt.hash(registerReq.password, 10)
        const user = await this.prismaService.user.create({
            data: registerReq
        })

        return {
            username: user.username,
            name: user.name,
        }
    }
}