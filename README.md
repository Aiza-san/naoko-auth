# Naoko Auth

> Set of functions to achieve authentication in different services such as google, github, etc.

## Installation

```bash
npm install naoko-auth
```

## Quick start

```ts
const { Github } = require("naoko-auth");

const github = new Github({
  redirectUri: process.env.GITHUB_REDIRECT_URI,
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
});

app.get("/auth/github", async (req, res) => {
  const { url } = await github.create();
  res.redirect(url);
});

app.get("/auth/callback/github", async (req, res) => {
  const { code } = req.query;
  if (!code) res.status(400).json({ message: "Code is required." });
  const data = await github.callback(code);
  console.log({ data });
  res.redirect(url);
});

app.get("/success", async (req, res) => {
  res.json({
    success: true,
  });
});

app.listen(3000);
```
