/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { AddressServices } from './address.service';
import { WebResponse } from '../model/web.model';
import { AddressResponse, CreateAddressRequest } from '../model/address.module';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
    constructor(private addressService: AddressServices) {}

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body() request: CreateAddressRequest,
    ): Promise<WebResponse<AddressResponse>> {
        request.contact_id = contactId;
        const result = await this.addressService.create(user, request);
        return {
            data: result,
        };
    }
}
