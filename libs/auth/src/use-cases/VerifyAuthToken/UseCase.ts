import { AuthErrors } from "@kopeka/auth/errors";
import { ITokenProvider } from "@kopeka/auth/providers";
import { BaseResponse, getCurrentHub, left, right, UseCase } from "@kopeka/core";

import {
    VerifyAuthTokenCommand, VerifyAuthTokenCommandSchema, VerifyAuthTokenDTO,
    VerifyAuthTokenPayload,
} from "./Command";

interface Cradle {
  firebaseTokenProvider: ITokenProvider;
}

export type VerifyAuthTokenResponse = BaseResponse<
  AuthErrors.InvalidToken,
  VerifyAuthTokenPayload
>;

export class VerifyAuthTokenUseCase extends UseCase<
  VerifyAuthTokenDTO,
  VerifyAuthTokenPayload,
  VerifyAuthTokenResponse
> {
  protected schema = VerifyAuthTokenCommandSchema;

  private tokenProvider: ITokenProvider;

  constructor(cradle: Cradle) {
    super("VerityAuthTokenUseCase");

    this.tokenProvider = cradle.firebaseTokenProvider;
  }

  async handler(req: VerifyAuthTokenCommand): Promise<VerifyAuthTokenResponse> {
    const hub = getCurrentHub();
    const logger = this.logger.child({
      methodName: "handler",
      traceId: hub.getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ request: req });

    let decoded: string | undefined;

    try {
      decoded = await this.tokenProvider.verifyIdToken(req.dto.token);
    } catch (err) {
      logger.warn({ error: err });
      return left(new AuthErrors.InvalidToken());
    }

    logger.trace(`END`);
    return right(decoded);
  }
}
