import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsNumber, Min, IsDateString, IsArray } from 'class-validator';

export class CreateAirdropDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    slug: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    raise?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsInt()
    createdBy?: number;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number) // để transform string -> number nếu frontend gửi string
    fundIds?: number[];
}
