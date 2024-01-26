import { ErrorHandle, type Context } from "shise";
import { Google } from "../../../src/index";

const google = new Google({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
});

export class GoogleTests {
  static async create(ctx: Context) {
    const { url } = await google.create();
    ctx.response.status(302);
    ctx.response.setHeader("Location", url);
    ctx.response.end();
  }

  static async callback(ctx: Context) {
    const successUrl = "http://localhost:3000/success";
    const { code } = ctx.request.query;
    if (!code) throw new ErrorHandle(400, "Code is required.");

    const data = await google.callback(code);
    console.log({ data });

    ctx.response.status(302);
    ctx.response.setHeader("Location", successUrl);
    ctx.response.end();
  }
}
