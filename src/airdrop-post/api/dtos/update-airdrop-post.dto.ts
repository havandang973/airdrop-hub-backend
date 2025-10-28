import { IsInt, IsOptional, IsString, IsNumber, Min, IsDateString, ValidateNested, IsArray, IsNotEmpty, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAirdropPostDto {
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
