import { DefaultState } from "koa";

import Router from "@koa/router";

import { AppContext } from "../..";

export function registerAuthRoutes(
  router: Router<DefaultState, AppContext>
): void {}
