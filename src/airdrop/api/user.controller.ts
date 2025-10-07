import { Body, Controller, Get, Logger, Put, Request, UseFilters } from '@nestjs/common';
import { MeResponse } from './dtos/me.response';
import { ApiHeader } from '@nestjs/swagger';
import { UpdateEmailAction } from '../actions/update-email.action';
import { UpdateEmailRequest } from './dtos/update-email.request';
import { SendVerificationAction } from '../actions/send-verification.action';
import { CastResponse } from 'src/cast-response';
import { ErrorExceptionFilter } from 'src/trading/exceptions/error-exception-filter';

@ApiHeader({
  name: 'Authorization',
})
@Controller('users')
@UseFilters(ErrorExceptionFilter)
export class UserController {
  constructor(
    private readonly updateEmailAction: UpdateEmailAction,
    private readonly sendVerificationAction: SendVerificationAction,
  ) { }

  @Get('me')
  @CastResponse(MeResponse)
  async getMe(@Request() request: object): Promise<MeResponse> {
    const user = request['user'];

    return user;
  }

  @Put('update-email')
  async updateEmail(@Request() request: object, @Body() body: UpdateEmailRequest) {
    let user = request['user'];

    user = await this.updateEmailAction.execute(user, body.email)

    await this.sendVerificationAction.execute(user)

    return { success: true, email: body.email }
  }
}
