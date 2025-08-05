import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // اضافه کردن پراپرتی accessToken به نوع Session
  }
}
