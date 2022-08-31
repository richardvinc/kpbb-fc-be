import { DefaultState } from "koa";

import Router from "@koa/router";
import { asMiddleware } from "@KPBBFC/core/infrastructure/http/koa";

import { AppContext } from "../..";
import { VerifyAuthToken } from "../../middlewares/VerifyAuthToken";
import { CreateUserController } from "./CreateUserController";
import { RetrieveUserController } from "./RetrieveUserController";

export function registerUsersRoutes(
  router: Router<DefaultState, AppContext>
): void {
  router.get(
    "/users",
    VerifyAuthToken(),
    asMiddleware(new RetrieveUserController())
  );
  router.post(
    "/users/",
    VerifyAuthToken(),
    asMiddleware(new CreateUserController())
  );
}
