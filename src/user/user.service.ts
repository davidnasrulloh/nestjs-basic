import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { Logger } from 'winston'
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt'
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import {v4 as uuid} from 'uuid'
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ){}

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.debug(`Register new user ${JSON.stringify(request)}`)
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

    async login(req: LoginUserRequest): Promise<UserResponse> {
        this.logger.debug(`UserService.login(${JSON.stringify(req)})`)
        const loginRequest: LoginUserRequest = this.validationService.validate(
            UserValidation.LOGIN,
            req
        )

        let user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if(!user){
            throw new HttpException('Username or password is wrong!', 401)
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)

        if(!isPasswordValid){
            throw new HttpException('Username or password is wrong!', 401)
        }

        user = await this.prismaService.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        return {
            username: user.username,
            name: user.name,
            token: user.token
        }

    }

    async get(user: User): Promise<UserResponse>{
        return {
            username: user.username,
            name: user.name
        }
    }

    async update(user: User, req: UpdateUserRequest): Promise<UserResponse>{
        this.logger.debug(`UserService.update(${JSON.stringify(user)}, ${JSON.stringify(req)})`)
        
        const updateRequest: UpdateUserRequest = this.validationService.validate(UserValidation.UPDATE, req)
        
        if(updateRequest.name){
            user.name = updateRequest.name
        }

        if(updateRequest.password){
            user.password = await bcrypt.hash(updateRequest.password, 10)
        }

        const result = await this.prismaService.user.update({
            where: {
                username: user.username
            },
            data: user
        })

        return {
            name: result.name,
            username: result.username
        }
    }

    async logout(user: User): Promise<UserResponse>{
        const result = await this.prismaService.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        })

        return {
            username: result.username,
            name: result.name
        }
    }
}