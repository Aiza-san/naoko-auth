import axios from "axios";

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class Google {
  readonly config: GoogleConfig;

  constructor(config: GoogleConfig) {
    this.config = config;
  }

  async create() {
    const { clientId, redirectUri } = this.config;
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/auth";
    return {
      url: `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`,
    };
  }

  async callback(code: string) {
    const { clientId, redirectUri, clientSecret } = this.config;

    const res = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const {
      access_token,
      id_token,
      expires_in,
      refresh_token,
      scope,
      token_type,
    } = res.data;

    const decodedToken = this.decodeIdToken(id_token);

    return {
      session: { user: decodedToken },
      access_token,
      expires_in,
      refresh_token,
      scope,
      token_type,
    };
  }

  private decodeIdToken(idToken: string): Record<string, any> {
    const base64Url = idToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(decoded);
  }
}
