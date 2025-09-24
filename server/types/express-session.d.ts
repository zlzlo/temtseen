import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: Record<string, unknown>;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    session: import("express-session").Session &
      import("express-session").SessionData;
  }
}
