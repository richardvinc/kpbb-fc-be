import { DefaultState } from "koa";

import Router from "@koa/router";

import { AppContext } from "../";
import { registerCarsRoutes } from "./cars";
import { registerFuelConsumptionRoutes } from "./fuelConsumption";
import { registerUsersRoutes } from "./users";

export function getRoutes(): Router<DefaultState, AppContext> {
  const router = new Router<DefaultState, AppContext>();

  registerUsersRoutes(router);
  registerCarsRoutes(router);
  registerFuelConsumptionRoutes(router);

  return router;
}
