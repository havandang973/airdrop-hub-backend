import { Injectable } from '@nestjs/common';
import { Account, Currency, User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { WithdrawStatus } from 'src/funding/enums/withdraw-status.enum';
import { CurrencyQuery } from './currency.query';
import { AccountLogType } from '../enums/account-log-type';
import { KycStatus } from '../enums/kyc-status';
import { SettingEnum } from 'src/common/system/setting.enum';
import { SystemSetting } from 'src/common/system/setting';
import Decimal from 'decimal.js';

@Injectable()
export class AirdropQuery {
  constructor(
    private prisma: PrismaService,
    private readonly currencyQuery: CurrencyQuery,
    private readonly setting: SystemSetting,
  ) { }

  async getById(id: number) {
    return await this.prisma.account.findUnique({
      where: {
        id,
      }
    });
  }

  async findByUser(user: User) {
    return await this.prisma.account.findMany({
      where: {
        userId: user.id,
      },
      include: {
        currency: true
      }
    });
  }

  async getByUserAndCurrency(user: User, currency: Currency) {
    return await this.prisma.account.findFirst({
      where: {
        userId: user.id,
        currencyId: currency.id
      },
    });
  }

  async getFreeBalance(account: Account) {
    const records = await this.prisma.accountWithdrawal.aggregate({
      _sum: {
        amount: true
      },
      where: {
        accountId: account.id,
        status: {
          in: [
            WithdrawStatus.Pending,
            WithdrawStatus.Processing,
            WithdrawStatus.Processed
          ]
        }
      }
    })

    const locked = records._sum.amount ?? 0;

    return account.balance.sub(locked);
  }

  async getMaxWithdrawal(user: User, currency: Currency): Promise<number> {
    const key = user.kycStatus === KycStatus.Verified ?
      SettingEnum.MaxWithdrawAfterKyc :
      SettingEnum.MaxWithdraw;

    const vol = await this.setting.get(key, true)

    return Number(new Decimal(vol).div(currency.price).toFixed(6, Decimal.ROUND_DOWN))
  }

  async isWithdrawable(account: Account, network: string) {
    const currency = await this.currencyQuery.getByCode(account.name, true)

    if (!currency.isSendable) {
      return false;
    }

    if (!currency.sendOn || !currency.sendOn.includes(network)) {
      return false;
    }

    return true;
  }

  getTypeByNote(note: string) {
    if (note.startsWith(AccountLogType.Withdraw)) {
      return AccountLogType.Withdraw
    }

    if (note.startsWith(AccountLogType.Deposit)) {
      return AccountLogType.Deposit
    }

    if (note.startsWith(AccountLogType.Swap)) {
      return AccountLogType.Swap
    }

    if (note.startsWith(AccountLogType.Buy)) {
      return AccountLogType.Buy
    }

    if (note.startsWith(AccountLogType.Sell)) {
      return AccountLogType.Sell
    }

    return AccountLogType.Bonus;
  }
}
