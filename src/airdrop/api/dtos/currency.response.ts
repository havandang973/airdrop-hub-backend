import { Expose, Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class CurrencyResponse {
  @Expose() name: string;
  @Expose() code: string;
  @Expose() isActive: boolean;

  @IsNumber()
  @Type(() => Number)
  @Expose() price: number;

  @Expose() isBuyable: boolean;
  @Expose() isSellable: boolean;
  @Expose() isSendable: boolean;
  @Expose() isReceivable: boolean;
  @Expose() isSwappable: boolean;


  @Expose() buyOn: string;
  @Expose() sellOn: string;
  @Expose() sendOn: string;
  @Expose() receiveOn: string;
}
