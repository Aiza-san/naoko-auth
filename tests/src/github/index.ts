import { ErrorHandle, type Context } from "shise";
import { Github } from "../../../src/index";

const github = new Github({
  redirectUri: process.env.GITHUB_REDIRECT_URI ?? "",
  clientId: process.env.GITHUB_CLIENT_ID ?? "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
});

export class GithubTests {
  static async create(ctx: Context) {
    const { url } = await github.create();
    ctx.response.status(302);
    ctx.response.setHeader("Location", url);
    ctx.response.end();
  }

  static async callback(ctx: Context) {
    const url = "http://localhost:3000/success";
    const { code } = ctx.request.query;
    if (!code) throw new ErrorHandle(400, "Code is required.");
    const data = await github.callback(code);
    console.log({ data });
    ctx.response.status(302);
    ctx.response.setHeader("Location", url);
    ctx.response.end();
  }
}
