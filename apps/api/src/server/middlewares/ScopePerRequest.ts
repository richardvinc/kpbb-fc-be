import { DefaultState, Middleware } from "koa";

import { getCurrentHub } from "@KPBBFC/core/hub";
import { IHub } from "@KPBBFC/types";

import { AppContext } from "../";
import { AppCradle, ApplicationService } from "../../app";

export function ScopePerRequest(): Middleware<DefaultState, AppContext> {
  return async (ctx: AppContext, next) => {
    return getCurrentHub().runScope(async () => {
      ctx.set("x-KPBBFC-request-id", getCurrentHub().getTraceId());
      ctx.appService =
        getCurrentHub<
          IHub<AppCradle, ApplicationService>
        >().getApplicationService();
      await next();
    });
  };
}
