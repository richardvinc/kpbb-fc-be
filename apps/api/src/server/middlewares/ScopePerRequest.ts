import { DefaultState, Middleware } from "koa";

import { getCurrentHub } from "@kopeka/core/hub";
import { IHub } from "@kopeka/types";

import { AppContext } from "../";
import { AppCradle, ApplicationService } from "../../app";

export function ScopePerRequest(): Middleware<DefaultState, AppContext> {
  return async (ctx: AppContext, next) => {
    return getCurrentHub().runScope(async () => {
      ctx.set("x-kopeka-request-id", getCurrentHub().getTraceId());
      ctx.appService =
        getCurrentHub<
          IHub<AppCradle, ApplicationService>
        >().getApplicationService();
      await next();
    });
  };
}
