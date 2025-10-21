import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAirdropPostDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsBoolean()
    visibility?: boolean;

    @IsOptional()
    @IsBoolean()
    pin?: boolean;

    @IsOptional()
    @IsInt()
    tagId?: number;

    @IsOptional()
    @IsInt()
    createdBy: number;

    @IsNotEmpty()
    @IsInt()
    airdropId: number;
}
