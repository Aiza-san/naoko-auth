import axios from "axios";

export interface DiscordConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class Discord {
  readonly config: DiscordConfig;

  constructor(config: DiscordConfig) {
    this.config = config;
  }

  async create() {
    const { clientId, redirectUri } = this.config;
    const discordAuthUrl = "https://discord.com/api/oauth2/authorize";
    return {
      url: `${discordAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`,
    };
  }

  async callback(code: string) {
    const { clientId, redirectUri, clientSecret } = this.config;

    const res = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        scope: "identify",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in, refresh_token, scope, token_type } =
      res.data;

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;

    return {
      session: { user },
      access_token,
      expires_in,
      refresh_token,
      scope,
      token_type,
    };
  }
}
