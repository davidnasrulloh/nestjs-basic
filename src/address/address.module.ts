import { Module } from "@nestjs/common";
import { AddressServices } from "./address.service";
import { AddressController } from "./address.controller";

@Module({
    providers: [AddressServices],
    controllers: [AddressController]
})
export class AddressModule {

}