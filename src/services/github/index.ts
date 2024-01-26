import axios from "axios";

export interface GithubConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class Github {
  readonly config: GithubConfig;

  constructor(config: GithubConfig) {
    this.config = config;
  }

  async create() {
    const { clientId, redirectUri } = this.config;
    const githubAuthUrl = "https://github.com/login/oauth/authorize";
    return {
      url: `${githubAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user`,
    };
  }

  async callback(code: string) {
    const { clientId, redirectUri, clientSecret } = this.config;

    const res = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }
    );

    const urlSearch = new URLSearchParams(res.data);

    const accessToken = urlSearch.get("access_token");
    const expires_in = urlSearch.get("expires_in");
    const refresh_token = urlSearch.get("refresh_token");
    const refresh_token_expires_in = urlSearch.get("refresh_token_expires_in");
    const scope = urlSearch.get("scope");
    const token_type = urlSearch.get("token_type");

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = userResponse.data;

    return {
      session: { user },
      accessToken,
      expires_in,
      refresh_token,
      refresh_token_expires_in,
      scope,
      token_type,
    };
  }
}
