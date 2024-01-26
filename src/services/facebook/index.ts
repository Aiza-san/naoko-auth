import axios from "axios";

export interface FacebookConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
}

export class Facebook {
  readonly config: FacebookConfig;

  constructor(config: FacebookConfig) {
    this.config = config;
  }

  async create() {
    const { appId, redirectUri } = this.config;
    const facebookAuthUrl = "https://www.facebook.com/v12.0/dialog/oauth";
    return {
      url: `${facebookAuthUrl}?client_id=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=email`,
    };
  }

  async callback(code: string) {
    const { appId, redirectUri, appSecret } = this.config;

    const res = await axios.get(
      "https://graph.facebook.com/v12.0/oauth/access_token",
      {
        params: {
          client_id: appId,
          client_secret: appSecret,
          code,
          redirect_uri: redirectUri,
        },
      }
    );

    const { access_token } = res.data;

    const userResponse = await axios.get(
      "https://graph.facebook.com/v12.0/me",
      {
        params: {
          fields: "id,email,name,first_name,last_name,picture",
          access_token,
        },
      }
    );

    const user = userResponse.data;

    return {
      session: { user },
      access_token,
    };
  }
}
