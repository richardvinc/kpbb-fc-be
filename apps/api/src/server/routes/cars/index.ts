import { DefaultState } from "koa";

import Router from "@koa/router";
import { asMiddleware } from "@KPBBFC/core/infrastructure/http/koa";

import { AppContext } from "../..";
import { VerifyAuthToken } from "../../middlewares/VerifyAuthToken";
import { RetrieveCarListController } from "./RetrieveCarListController";

export function registerCarsRoutes(
  router: Router<DefaultState, AppContext>
): void {
  router.get(
    "/cars",
    VerifyAuthToken(),
    asMiddleware(new RetrieveCarListController())
  );
}
