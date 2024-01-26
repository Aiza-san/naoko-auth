import "dotenv/config";
import { App, Controller, Router } from "shise";
import { GithubTests } from "./github";
import { DiscordTests } from "./discord";
import { FacebookTests } from "./facebook";
import { GoogleTests } from "./google";

const controller = new Controller();

const routes = new Router({
  success: controller.get(async (ctx) => {
    ctx.response.json({
      success: true,
    });
    ctx.response.end();
  }),
  auth: new Router({
    github: controller.get(GithubTests.create),
    facebook: controller.get(FacebookTests.create),
    discord: controller.get(DiscordTests.create),
    google: controller.get(GoogleTests.create),
    callback: new Router({
      github: controller.get(GithubTests.callback),
      facebook: controller.get(FacebookTests.callback),
      discord: controller.get(DiscordTests.callback),
      google: controller.get(GoogleTests.callback),
    }),
  }),
});

const app = new App(routes);

app.listen(3000);
