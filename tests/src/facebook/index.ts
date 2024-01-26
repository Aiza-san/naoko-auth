import { ErrorHandle, type Context } from "shise";
import { Facebook } from "../../../src/index";

const facebook = new Facebook({
  redirectUri: process.env.FACEBOOK_REDIRECT_URI ?? "",
  appId: process.env.FACEBOOK_APP_ID ?? "",
  appSecret: process.env.FACEBOOK_APP_SECRET ?? "",
});

export class FacebookTests {
  static async create(ctx: Context) {
    const { url } = await facebook.create();
    ctx.response.status(302);
    ctx.response.setHeader("Location", url);
    ctx.response.end();
  }

  static async callback(ctx: Context) {
    const url = "http://localhost:3000/success";
    const { code } = ctx.request.query;
    if (!code) throw new ErrorHandle(400, "Code is required.");
    const data = await facebook.callback(code);
    console.log({ data });
    ctx.response.status(302);
    ctx.response.setHeader("Location", url);
    ctx.response.end();
  }
}
