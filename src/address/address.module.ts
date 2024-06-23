/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AddressServices } from './address.service';
import { AddressController } from './address.controller';
import { ContactService } from '../contact/contact.service';

@Module({
    providers: [AddressServices, ContactService],
    controllers: [AddressController],
})
export class AddressModule {}
