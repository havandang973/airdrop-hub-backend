import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  name?: string;
}
