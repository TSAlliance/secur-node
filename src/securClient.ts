import { AllianceSDK, ApiError } from "alliance-sdk";
import { AllianceConfig, AllianceRouteMethod } from "alliance-sdk/lib/request";
import { ClientNetworkError } from "alliance-sdk/lib/errors";

import { SecurMember } from "./securMember";
import {
  SecurAccountNotFoundError,
  SecurInvalidSessionError,
} from "./securError";

const ALLIANCE_SDK_INSTANCE = "securAllianceSDKInstance";

export class SecurClient {
  public static init(config: AllianceConfig) {
    AllianceSDK.createInstance(ALLIANCE_SDK_INSTANCE, config);
  }

  /**
   * Load client's data
   * @returns Promise of type SecurMember
   */
  public static async login(): Promise<SecurMember> {
    return new Promise((resolve, reject) => {
      AllianceSDK.getInstance(ALLIANCE_SDK_INSTANCE)
        .request<SecurMember>({
          method: AllianceRouteMethod.GET,
          path: "/members/:id",
          params: {
            id: "@me",
          },
          authRequired: true,
        })
        .perform()
        .then((member) => {
          resolve(member);
        })
        .catch((error: ApiError) => {
          if (error.statusCode) {
            if (error.statusCode == 404) {
              reject(new SecurAccountNotFoundError());
            } else {
              reject(new SecurInvalidSessionError());
            }
          } else {
            if (error.message == "Network Error") {
              reject(new ClientNetworkError());
            } else {
              reject(error);
            }
          }
        });
    });
  }
}
