import { ApiError } from "@tsalliance/sdk";
import axios, { AxiosResponse } from "axios";
import { ClientNetworkError } from "@tsalliance/sdk/lib/error/errors";
import { SecurMember } from "./securMember";
import {
  SecurAccountNotFoundError,
  SecurUnauthorizedError,
} from "./securError";

export interface SecurConfig {
  protocol: string;
  host: string;
  port: number;
  path?: string;
}

export class SecurClient {
  private static _config: SecurConfig;

  public static init(config: SecurConfig) {
    this._config = config;
  }

  public static async loginWithToken(token: string): Promise<SecurMember> {
    if (!this._config) {
      throw new Error(
        "SecurClient was never initted. Therefor no config is present which is needed for the client to work. Please init SecurClient using SecurClient.init() first."
      );
    }

    return new Promise((resolve, reject) => {
      axios
        .get("/members/@me", {
          headers: {
            Authorization: "Bearer " + token,
          },
          baseURL:
            this._config.protocol +
            "://" +
            this._config.host +
            ":" +
            this._config.port +
            this._config.path,
        })
        .then((value: AxiosResponse<SecurMember>) => {
          if (value.status != 200) {
            reject(value.data);
          } else {
            resolve(value.data);
          }
        })
        .catch((reason) => {
          if (reason.response) {
            const response: AxiosResponse<ApiError> = reason.response;

            if (response.status == 404) {
              reject(new SecurAccountNotFoundError());
            } else if (response.status == 403) {
              reject(new SecurUnauthorizedError());
            } else {
              reject(response.data as ApiError);
            }
          } else {
            if (reason.message == "Network Error") {
              reject(new ClientNetworkError());
            } else {
              reject(reason as ApiError);
            }
          }
        });
    });
  }
}
