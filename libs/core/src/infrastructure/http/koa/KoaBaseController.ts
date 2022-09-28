import {
  Context,
  DefaultContext,
  DefaultState,
  Middleware,
  Next,
  ParameterizedContext,
} from "koa";

import {
  HttpErrorResponse,
  HttpResponse,
  HttpSuccessResponse,
  ILogger,
} from "@KPBBFC/types";

import { BaseError, InternalError } from "../../../errors";
import { getCurrentHub } from "../../../hub";

interface ExecutionContext {
  traceId: string;
  koa: {
    ctx: Context;
  };
  status: number;
  body: HttpResponse<unknown>;
  error?: Error;
}

export abstract class KoaBaseController<TContext extends DefaultContext> {
  private context!: ExecutionContext;

  protected abstract executeImpl(): Promise<void>;

  protected ctx!: ParameterizedContext<DefaultState, TContext>;
  protected logger: ILogger;

  constructor(name: string) {
    this.logger = getCurrentHub().getLogger(name);
  }

  public async execute(
    ctx: ParameterizedContext<DefaultState, TContext>,
    next: Next
  ): Promise<void> {
    const logger = this.logger.child({
      method: "execute",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    this.setExecutionContext(ctx);

    try {
      await this.executeImpl();
      this.flushContext();

      if (!this.context.error) {
        await next();
      }
    } catch (err) {
      const error = new InternalError.UnexpectedError(
        err,
        "ControllerException"
      );
      logger.fatal({ error: error.toString() });
      this.setErrorResponse(500, error);
      this.flushContext();
      ctx.app.emit("error", error, ctx);
    }

    logger.trace(`END`);
  }

  private flushContext(): void {
    this.context.koa.ctx.status = this.context.status;
    this.context.koa.ctx.body = this.context.body;
  }

  private setExecutionContext(
    ctx: ParameterizedContext<DefaultState, TContext>
  ): void {
    this.ctx = ctx;
    this.context = {
      traceId: getCurrentHub().getTraceId(),
      koa: { ctx },
      status: 500,
      error: undefined,
      body: {
        ok: false,
        error: {
          code: "internal/response-not-set",
        },
      } as HttpErrorResponse,
    };
  }

  private setErrorResponse(statusCode: number, err: BaseError): void {
    this.context.error = err;
    this.context.status = statusCode;
    this.context.body = {
      $metadata: {
        request_id: this.context.traceId,
      },
      ok: false,
      error: {
        code: err.code,
        message: err.message === "" ? undefined : err.message,
        stack: err.stack,
      },
    } as HttpErrorResponse;
  }

  public ok<T>(dto?: T, metadata?: { [key: string]: unknown }): void {
    this.context.status = 200;
    this.context.body = {
      $metadata: {
        request_id: this.context.traceId,
        ...metadata,
      },
      ok: true,
      ...dto,
    } as HttpSuccessResponse<T>;
  }

  public badRequest(err: BaseError): void {
    this.setErrorResponse(400, err);
  }

  public noAuth(err: BaseError): void {
    this.setErrorResponse(401, err);
  }

  public fail(err: BaseError): never {
    throw err;
  }
}

export function asMiddleware<TContext>(
  controller: KoaBaseController<TContext>
): Middleware<DefaultState, TContext> {
  return async (ctx, next) => {
    return controller.execute(ctx, next);
  };
}
