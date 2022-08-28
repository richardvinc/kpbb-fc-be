import { DefaultState } from "koa";

import Router from "@koa/router";

import { AppContext } from "../";
import { registerUsersRoutes } from "./users";

export function getRoutes(): Router<DefaultState, AppContext> {
  const router = new Router<DefaultState, AppContext>();

  registerUsersRoutes(router);

  return router;
}
