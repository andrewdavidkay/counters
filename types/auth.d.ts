import "auth";

declare module "auth" {
  interface DefaultUser {
    username?: string;
  }

  interface DefaultSession {
    user?: DefaultUser;
  }
}
