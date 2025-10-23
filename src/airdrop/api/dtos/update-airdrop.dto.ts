import { IsInt, IsOptional, IsString, IsNumber, Min, IsDateString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAirdropDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

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
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number) // để transform string -> number nếu frontend gửi string
  fundIds?: number[];
}
