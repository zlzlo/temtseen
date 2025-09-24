declare module "cors" {
  import type { RequestHandler } from "express";

  export interface CorsOptions {
    origin?:
      | boolean
      | string
      | RegExp
      | (string | RegExp)[]
      | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean | string) => void) => void);
    credentials?: boolean;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }

  export type CorsRequestHandler = RequestHandler;

  const cors: (options?: CorsOptions) => CorsRequestHandler;
  export default cors;
}
