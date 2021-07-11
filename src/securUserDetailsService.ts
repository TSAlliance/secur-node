import { ApiError, UserDetails, UserDetailsService } from "@tsalliance/sdk";
import { ResolvedUserId } from "@tsalliance/sdk/lib/auth/userDetails";
import { SecurClient } from "./securClient";

import {
  SecurAccountNotFoundError,
  SecurSessionExpiredError,
  SecurUnauthorizedError,
} from "./securError";
import { SecurMember } from "./securMember";

export class SecurUserDetailsService extends UserDetailsService {
  public loadUserDetails(resolvedUserId: ResolvedUserId): Promise<UserDetails> {
    return new Promise((resolve, reject) => {
      if (!resolvedUserId.value) {
        reject(new SecurUnauthorizedError());
      }

      SecurClient.loginWithToken(resolvedUserId.value)
        .then((member: SecurMember) => {
          if (!member) {
            reject(new SecurAccountNotFoundError());
          }

          // We need to create a new object instance. Otherwise
          // functions like hasPermission() are undefined.
          // This happens because internally these are just JSON objects
          // that were casted to SecurMember
          member = new SecurMember(member);
          member.isAuthenticated = true;
          member.authenticationError = null;

          resolve(member);
        })
        .catch((reason: ApiError) => {
          // Of course, its only SecurUnauthorized that hits on status 403,
          // but because of the if statement at the top
          // we know, that at this point a header with a valid token must have
          // been sent. That's why we can return SessionExpired Error.
          if (reason.statusCode == 403) {
            reject(new SecurSessionExpiredError());
          } else {
            reject(reason);
          }
        });
    });
  }

  public resolveUserIdFromRequest(request: any): ResolvedUserId {
    const authorizationHeader = request.headers["authorization"];

    try {
      if (authorizationHeader?.startsWith("Bearer")) {
        const token = authorizationHeader.slice(7);
        return { value: token, additionalData: {} };
      }
    } catch (error) {}

    return null;
  }
  public isAuthorizationPresent(request: any): boolean {
    const authorizationHeader = request.headers["authorization"];
    return !!authorizationHeader && authorizationHeader.startsWith("Bearer");
  }
}
