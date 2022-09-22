import { DefaultState } from "koa";

import Router from "@koa/router";
import { asMiddleware } from "@KPBBFC/core/infrastructure/http/koa";

import { AppContext } from "../..";
import { RetrieveAccumulatedFuelConsumptionByCarController } from "./RetrieveAccumulatedFuelConsumptionByCarController";
import { RetrieveAccumulatedFuelConsumptionListController } from "./RetrieveAccumulatedFuelConsumptionListController";
import { RetrieveTop10AccumulatedFuelConsumptionListController } from "./RetrieveTop10AccumulatedFuelConsumptionListController";

export function registerFuelConsumptionRoutes(
  router: Router<DefaultState, AppContext>
): void {
  router.get(
    "/fuel-consumptions",
    asMiddleware(new RetrieveAccumulatedFuelConsumptionListController())
  );
  router.get(
    "/fuel-consumptions/top-10",
    asMiddleware(new RetrieveTop10AccumulatedFuelConsumptionListController())
  );
  router.get(
    "/fuel-consumptions/cars/:id",
    asMiddleware(new RetrieveAccumulatedFuelConsumptionByCarController())
  );
}
