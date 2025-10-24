import {
    IsBoolean,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    ArrayNotEmpty,
    ArrayUnique,
} from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsInt()
    view?: number;

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
    @IsBoolean()
    pin_to_home?: boolean;

    @IsOptional()
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    tagIds?: number[];

    @IsNotEmpty()
    @IsInt()
    createdBy: number;
}
