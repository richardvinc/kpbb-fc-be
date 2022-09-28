import { Server as HttpServer } from "http";
import koa, { DefaultContext } from "koa";
import body from "koa-body";
import helmet from "koa-helmet";
import qs from "koa-qs";

import cors from "@koa/cors";
import { getCurrentHub } from "@KPBBFC/core/hub";
import { ILogger } from "@KPBBFC/types";
import { User } from "@KPBBFC/user";

import { ApplicationService } from "../app/";
import { HealthCheck } from "./middlewares/HealthCheck";
import { RequestIdentityParser } from "./middlewares/RequestIdentityParser";
import { RequestLog } from "./middlewares/RequestLog";
import { ScopePerRequest } from "./middlewares/ScopePerRequest";
import { getRoutes } from "./routes";

interface ServerOptions {
  port?: number;
}

export interface Identity {
  firebaseUid?: string;
  id?: string;
  phoneNumber?: string;
  token?: string;
  user?: User;
}

export interface AppContext extends DefaultContext {
  appService: ApplicationService;
  identity: Identity;
}

export class Server {
  private app: koa;
  private server!: HttpServer;
  private options: ServerOptions;

  private logger: ILogger;

  private defaultOptions: ServerOptions = {
    port: 3000,
  };

  constructor(options?: ServerOptions) {
    this.logger = getCurrentHub().getLogger("Server");
    this.options = Object.assign({}, this.defaultOptions, options);
    this.app = new koa();

    qs(this.app, "first");

    this.attachMiddlewares();
    this.registerRoutes();
  }

  private attachMiddlewares(): void {
    const logger = this.logger.child({ method: "attachMiddlewares" });
    logger.trace(`BEGIN`);

    this.app
      .use(ScopePerRequest())
      .use(
        helmet({
          contentSecurityPolicy: false,
        })
      )
      .use(
        RequestLog({
          logger: this.logger,
          excludePath: ["/health"],
        })
      )
      .use(HealthCheck())
      .use(
        cors({
          // TODO handle cors origin properly
          origin: "*",
          allowMethods: ["GET", "POST", "DELETE", "PUT"],
        })
      )
      .use(
        body({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onError: (err, ctx) => {
            // TODO handle error to confirm with HttpResponse typings
          },
        })
      )
      .use(RequestIdentityParser());

    logger.trace(`END`);
  }

  private registerRoutes(): void {
    const router = getRoutes();
    this.app.use(router.routes()).use(router.allowedMethods());
  }

  async launch(): Promise<HttpServer> {
    const logger = this.logger.child({ method: "launch" });
    logger.trace(`BEGIN`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, _) => {
      this.server = this.app.listen(this.options.port, () => {
        logger.info(`server launched on port ${this.options.port}`);
        logger.trace(`END`);
        return resolve(this.server);
      });
    });
  }
}
