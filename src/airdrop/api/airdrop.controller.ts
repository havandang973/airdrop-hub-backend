import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseFilters } from "@nestjs/common";
import { AccountQuery } from "../queries/airdrop.query";
import { AccountResponse } from "./dtos/account.response";
import { AccountLogResponse } from "./dtos/account-log.response";
import { AccountLogQuery } from "../queries/account-log.query";
import { ApiHeader } from "@nestjs/swagger";
import { Utils } from "src/common/utils";
import { ErrorExceptionFilter } from "src/trading/exceptions/error-exception-filter";
import { PaginationRequest } from "src/common/pagination/pagination.request";
import { LogTypeRequest } from "./dtos/log-type.request";
import { E4010_InvalidAction } from "src/trading/exceptions/E4010-invalid-action";
import { AccountLimitRequest } from "./dtos/account-limit.request";
import { E4001_CurrencyNotSupported } from "src/trading/exceptions/E4001-currency-not-supported";
import { CurrencyQuery } from "../queries/currency.query";
import { SettingQuery } from "src/funding/queries/setting.query";
import { EventEmitter2 } from "@nestjs/event-emitter";

@ApiHeader({
  name: 'Authorization',
})
@Controller('accounts')
@UseFilters(ErrorExceptionFilter)
export class AccountController {
  public constructor(
    private readonly accountQuery: AccountQuery,
    private readonly accountLogQuery: AccountLogQuery,
    private readonly currencyQuery: CurrencyQuery,
    private readonly setting: SettingQuery,
    private readonly events: EventEmitter2,
  ) { }

  @Get()
  public async getAi(@Request() request: object) {
    const user = request['user'];

    this.events.emit('user.online', { user });

    const accounts = await this.accountQuery.findByUser(user);

    return Promise.all(
      accounts.map(async account => {
        const item = {
          id: account.id,
          balance: account.balance,
          freeBalance: await this.accountQuery.getFreeBalance(account),
          currency: account.name,
          name: account.currency.name,
          estimate: account.balance.mul(account.currency.price)
        }

        return Utils.toResponse(AccountResponse, item)
      })
    )
  }

  @Post('limits')
  public async limits(@Request() request: object, @Body() body: AccountLimitRequest) {
    const user = request['user'];

    const currency = await this.currencyQuery.getByCode(body.currency, true);
    const network = body.network;

    if (!currency.isActive) {
      throw new E4001_CurrencyNotSupported()
    }

    return {
      withdrawalFee: (await this.setting.getWithdrawFee(currency, network)),
      minWithdrawal: (await this.setting.getMinWithdraw(currency, network)),
      maxWithdrawal: (await this.accountQuery.getMaxWithdrawal(user, currency)),
      minDeposit: (await this.setting.getMinDeposit(currency, network)),
    }
  }

  @Get(':id/logs')
  public async getLogsByAccount(
    @Request() request: object,
    @Param('id', ParseIntPipe) id: number,
    @Query() paginate: PaginationRequest
  ) {
    const user = request['user'];
    const account = await this.accountQuery.getById(id);

    if (!account) {
      throw new E4010_InvalidAction()
    }

    const result = await this.accountLogQuery.getByAccount(account, user.id, paginate);

    const data = result.data.map(log => {
      const item: AccountLogResponse = {
        type: log.type,
        currency: log.account.name,
        change: log.change,
        note: log.note,
        createdAt: log.createdAt
      }

      return Utils.toResponse(AccountLogResponse, item)
    })

    return {
      data,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      size: result.size,
      total: result.total
    }
  }
}
