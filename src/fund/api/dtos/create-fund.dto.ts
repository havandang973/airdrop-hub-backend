import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFundDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    slug: string;
}
