import { IsOptional, IsString } from 'class-validator';

export class UpdateFundDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  slug: string;
}
