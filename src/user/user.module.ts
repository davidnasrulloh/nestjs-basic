import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";

@Module({
    providers: [UserService, PrismaService, ValidationService],
    controllers: [UserController],
})
export class UserModule {}