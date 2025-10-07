import { Expose, Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class AccountResponse {
  @Expose() id: number;
  @Expose() currency: string;
  @Expose() name: string;

  @IsNumber()
  @Type(() => Number)
  @Expose() balance: number;

  @IsNumber()
  @Type(() => Number)
  @Expose() freeBalance: number;

  @IsNumber()
  @Type(() => Number)
  @Expose() estimate: number;
}
