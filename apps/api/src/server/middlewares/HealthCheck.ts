import { Context, Middleware } from "koa";

import { getCurrentHub } from "@KPBBFC/core/hub";
import { HttpSuccessResponse } from "@KPBBFC/types";

interface HealthCheckOptions {
  method?: "GET" | "HEAD" | "POST";
  path?: string;
  status?: number;
  onHealthCheck?: (ctx: Context) => HttpSuccessResponse<{}>;
}

export function HealthCheck(options?: HealthCheckOptions): Middleware {
  const getDefaultResponse = (): HttpSuccessResponse<{}> => {
    return {
      $metadata: {
        request_id: getCurrentHub().getTraceId(),
      },
      version: "1.1.3",
      ok: true,
    };
  };

  const defaultOptions: HealthCheckOptions = {
    method: "GET",
    path: "/health",
    status: 200,
  };

  const opts = Object.assign({}, options, defaultOptions);

  return async (ctx, next) => {
    const body = opts.onHealthCheck
      ? opts.onHealthCheck(ctx)
      : getDefaultResponse();

    if (ctx.path === opts.path && ctx.method === opts.method) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.status = opts.status!;
      ctx.body = body;
      return;
    } else {
      await next();
    }
  };
}
