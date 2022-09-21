import { DefaultState } from "koa";

import Router from "@koa/router";
import { asMiddleware } from "@KPBBFC/core/infrastructure/http/koa";

import { AppContext } from "../..";
import { RetrieveCarListController } from "./RetrieveCarListController";

export function registerCarsRoutes(
  router: Router<DefaultState, AppContext>
): void {
  router.get("/cars", asMiddleware(new RetrieveCarListController()));
}
