import { ErrorHandle, type Context } from "shise";
import { Discord } from "../../../src/index";

const discord = new Discord({
  redirectUri: process.env.DISCORD_REDIRECT_URI ?? "",
  clientId: process.env.DISCORD_CLIENT_ID ?? "",
  clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
});

export class DiscordTests {
  static async create(ctx: Context) {
    const { url } = await discord.create();
    ctx.response.status(302);
    ctx.response.setHeader("Location", url);
    ctx.response.end();
  }

  static async callback(ctx: Context) {
    const url = "http://localhost:3000/success";
    const { code } = ctx.request.query;
    if (!code) throw new ErrorHandle(400, "Code is required.");
    const data = await discord.callback(code);
    console.log({ data });
    ctx.response.status(302);
    ctx.response.setHeader("Location", url);
    ctx.response.end();
  }
}
