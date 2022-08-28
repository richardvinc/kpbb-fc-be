import { DefaultState, Middleware } from "koa";
import { AppContext } from "..";

export function RequestIdentityParser(): Middleware<DefaultState, AppContext> {
  return async (ctx, next) => {
    ctx.identity = {};

    const auth: string | undefined = ctx.get("Authorization");
    if (auth) {
      const [type, token] = auth.split(" ");
      if (type.toLowerCase() === "bearer") {
        ctx.identity.token = token;
      }
    }
    await next();
  };
}
