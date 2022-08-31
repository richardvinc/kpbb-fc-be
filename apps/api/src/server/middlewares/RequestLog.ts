import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";
import { Middleware } from "koa";
import { ParsedUrlQuery } from "querystring";

import { getCurrentHub } from "@KPBBFC/core/hub";
import { ILogger } from "@KPBBFC/types";

interface RequestLogOptions {
  logger: ILogger;
  excludePath?: string[];
}

interface Request {
  time: number;
  method: string;
  path: string;
  ip: string;
  headers: IncomingHttpHeaders;
  query: ParsedUrlQuery;
}

interface Response {
  time: number;
  responseTime: number;
  length: number;
  status: number;
  statusBucket: string;
  body: unknown;
  headers: OutgoingHttpHeaders;
}

export function RequestLog(options: RequestLogOptions): Middleware {
  return async (ctx, next) => {
    const logger = options.logger.child({
      method: "onRequest",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace(`BEGIN`);

    if (options.excludePath && options.excludePath.includes(ctx.path)) {
      await next();
    } else {
      const startTime = new Date();
      const req: Request = {
        time: startTime.getTime(),
        path: ctx.path,
        method: ctx.method,
        ip: ctx.request.ip,
        headers: ctx.request.headers,
        query: ctx.request.query,
      };

      const endRequest = () => {
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();

        const { length, status } = ctx.response;
        const bucket = `${status}`.substr(0, 1);
        const statusBucket = bucket + "XX";

        const res: Response = {
          time: endTime.getTime(),
          responseTime: duration,
          length: +length,
          status: +status,
          statusBucket,
          body: ctx.body,
          headers: ctx.response.headers,
        };

        logger.info({ request: req, response: res });
        logger.trace(`END`);
      };

      let error;

      try {
        await next();
      } catch (err) {
        error = err;
      } finally {
        endRequest();
        if (error) {
          // throw error for the previous
          // middleware to handle
          throw error;
        }
      }
    }
  };
}
