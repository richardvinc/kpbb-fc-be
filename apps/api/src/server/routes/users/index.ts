import { DefaultState } from "koa";

import Router from "@koa/router";
import { asMiddleware } from "@KPBBFC/core/infrastructure/http/koa";

import { AppContext } from "../..";
import { VerifyAuthToken } from "../../middlewares/VerifyAuthToken";
import { VerifyUser } from "../../middlewares/VerifyUser";
import { CreateUserCarController } from "./CreateUserCarController";
import { CreateUserController } from "./CreateUserController";
import { CreateUserFuelConsumptionController } from "./CreateUserFuelConsumptionController";
import { RetrieveUserCarListController } from "./RetrieveUserCarListController";
import { RetrieveUserController } from "./RetrieveUserController";
import { RetrieveUserFuelConsumptionListByCarController } from "./RetrieveUserFuelConsumptionListByCarController";
import { RetrieveUserFuelConsumptionSummaryListController } from "./RetrieveUserFuelConsumptionSummaryListController";
import { RetrieveUserListController } from "./RetrieveUserListController";

export function registerUsersRoutes(
  router: Router<DefaultState, AppContext>
): void {
  // users
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

  router.get("/users/:path", VerifyAuthToken(), VerifyUser(), (ctx, next) => {
    switch (ctx.params.path) {
      case "cars":
        return asMiddleware(new RetrieveUserCarListController())(ctx, next);
      default:
        return asMiddleware(new RetrieveUserController())(ctx, next);
    }
  });

  router.post(
    "/users/cars",
    VerifyAuthToken(),
    VerifyUser(),
    asMiddleware(new CreateUserCarController())
  );
  router.get(
    "/users/cars/fuel/summary",
    VerifyAuthToken(),
    VerifyUser(),
    asMiddleware(new RetrieveUserFuelConsumptionSummaryListController())
  );

  router.get(
    "/users/cars/:userCarId/fuel",
    VerifyAuthToken(),
    VerifyUser(),
    asMiddleware(new RetrieveUserFuelConsumptionListByCarController())
  );
  router.post(
    "/users/cars/:userCarId/fuel",
    VerifyAuthToken(),
    VerifyUser(),
    asMiddleware(new CreateUserFuelConsumptionController())
  );
}
