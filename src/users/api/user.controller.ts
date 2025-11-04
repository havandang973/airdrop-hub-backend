import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { UserQuery } from '../queries/user.query';

@Controller('tags')
export class TagController {
    constructor(private readonly userQuery: UserQuery) { }

    // 🟢 Lấy tất cả tag
    // @Get()
    // @UseGuards(ApiKeyGuard)
    // async getAllTag() {
    //     const tag = await this.userQuery.findAll();

    //     return tag.map((item) => ({
    //         id: item.id,
    //         name: item.name,
    //         // createdAt: item.created_at,
    //     }));
    // }

    // 🟢 Lấy user theo id
    // @Get(':id')
    // async findById(@Param('id') id: string) {
    //     const tag = await this.userQuery.findById(Number(id));

    //     if (!tag) {
    //         throw new NotFoundException(`Tag with id "${id}" not found`);
    //     }

    //     return {
    //         id: tag.id,
    //         name: tag.name,
    //         // createdAt: tag.created_at,
    //     };
    // }
}
