import { ApiError } from "@tsalliance/sdk";

export class SecurAccountNotFoundError extends ApiError {
  constructor() {
    super("Your account could not be found.", 404, "SECUR_ACCOUNT_MISSING");
  }
}

export class SecurInvalidSessionError extends ApiError {
  constructor() {
    super(
      "Deine Sitzung ist ungültig. Bitte melde dich erneut an.",
      403,
      "SECUR_INVALID_SESSION"
    );
  }
}

export class SecurUnauthorizedError extends ApiError {
  constructor() {
    super("You need to authenticate", 403, "SECUR_UNAUTHORIZED_ERROR");
  }
}

export class SecurSessionExpiredError extends ApiError {
  constructor() {
    super("Your session has expired", 403, "SECUR_SESSION_EXPIRED");
  }
}
