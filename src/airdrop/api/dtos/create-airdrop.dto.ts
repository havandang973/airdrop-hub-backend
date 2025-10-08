import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateAirdropDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    content: string;

    @IsString()
    avatar: string;

    @IsString()
    status: string;

    @IsNumber()
    @Min(0)
    total_raise: number;

    @IsInt()
    category_id: number;

    @IsInt()
    created_by: number;
}
