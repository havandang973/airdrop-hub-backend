import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserController } from './api/user.controller';
import { AuthController } from './api/auth.controller';
import { UserQuery } from './queries/user.query';
import { AccountQuery } from './queries/airdrop.query';
import { AccountLogQuery } from './queries/account-log.query';
import { CreateAccountAction } from './actions/create-account.action';
import { CreateDefaultAccountsAction } from './actions/create-default-accounts.action';
import { LaunchUserAction } from './actions/launch-user.action';
import { AccountController } from './api/account.controller';
import { ConfigService } from '@nestjs/config';
import { PricingQuery } from 'src/trading/queries/pricing.query';
import { AlixpayService } from 'src/common/services/alixpay.service';
import { UpdateEmailAction } from './actions/update-email.action';
import { SendVerificationAction } from './actions/send-verification.action';
import { VerifyEmailAction } from './actions/verify-email.action';
import { KycAction } from './actions/kyc.action';
import { CurrencyController } from './api/currency.controller';
import { CurrencyQuery as Currency } from './queries/currency.query';
import { JobUpdateKycStatus } from './jobs/update-kyc-status.job';
import { UserSetting } from './queries/user-setting.query';
import { GetAccessTokenAction } from './actions/get-access-token.action';
import { SettingController } from './api/setting.controller';
import { CreateDefaultSettingsAction } from './actions/create-default-settings.action';
import { OrderQuery } from 'src/trading/queries/order.query';
import { EncodeService } from 'src/common/encode';
import { InitProfileListener } from './listeners/init-profile.listener';
import { CurrencySeeder } from './seeders/currency.seeder';
import { Generate2FASecretAction } from './actions/generate-2fa-secret.action';
import { Verify2FAAction } from './actions/verify-2fa.action';
import { Google2FAAuthGuard } from './api/google2fa-auth.guard';
import { SystemSetting } from 'src/common/system/setting';
import { JobUpdateMarketPrice } from './jobs/update-market-price.job';
import { CacheService } from 'src/common/services/cache.service';
import { SettingQuery } from 'src/funding/queries/setting.query';

import { UserOnlineListener } from './listeners/user-online.listener';
import { JobClearActivityLogs } from './jobs/clear-activity-logs.job';

import { FiatCurrencyController } from 'src/trading/api/fiat.controller';
import { FiatCurrencyQuery } from './queries/fiat-currency.query';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    // CacheModule.register({
    //   ttl: 0
    // })
  ],
  providers: [
    PrismaService,
    AlixpayService,
    ConfigService,
    EncodeService,
    CacheService,

    UserQuery,
    AccountQuery,
    AccountLogQuery,
    PricingQuery,
    Currency,
    UserSetting,
    OrderQuery,
    SystemSetting,
    SettingQuery,
    FiatCurrencyQuery,

    CreateAccountAction,
    CreateDefaultAccountsAction,
    LaunchUserAction,
    UpdateEmailAction,
    SendVerificationAction,
    VerifyEmailAction,
    KycAction,
    GetAccessTokenAction,
    CreateDefaultSettingsAction,
    Generate2FASecretAction,
    Verify2FAAction,

    InitProfileListener,
    UserOnlineListener,

    CurrencySeeder,

    JobUpdateKycStatus,
    // JobRefactorAccountLog,
    JobUpdateMarketPrice,
    JobClearActivityLogs,

    Google2FAAuthGuard,
  ],
  exports: [
    AccountQuery
  ],
  controllers: [UserController, AuthController, AccountController, CurrencyController, SettingController, FiatCurrencyController],
})
export class AccountModule { }
