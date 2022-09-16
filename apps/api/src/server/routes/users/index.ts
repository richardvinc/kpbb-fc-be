import { DefaultState } from "koa";

import Router from "@koa/router";
import { asMiddleware } from "@KPBBFC/core/infrastructure/http/koa";

import { AppContext } from "../..";
import { VerifyAuthToken } from "../../middlewares/VerifyAuthToken";
import { CreateUserController } from "./CreateUserController";
import { RetrieveUserController } from "./RetrieveUserController";
import { RetrieveUserListController } from "./RetrieveUserListController";

export function registerUsersRoutes(
  router: Router<DefaultState, AppContext>
): void {
  router.get(
    "/users",
    VerifyAuthToken(),
    asMiddleware(new RetrieveUserListController())
  );
  router.post(
    "/users",
    VerifyAuthToken(),
    asMiddleware(new CreateUserController())
  );
  router.get(
    "/users/:id",
    VerifyAuthToken(),
    asMiddleware(new RetrieveUserController())
  );
}
