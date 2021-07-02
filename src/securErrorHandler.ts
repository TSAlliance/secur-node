import { ApiError } from "alliance-sdk";
import {
  SecurAccountNotFoundError,
  SecurInvalidSessionError,
} from "./securError";

export interface SecurErrorHandler {
  handleAccountNotFound?(error: SecurAccountNotFoundError);
  handleSessionExpired?(error: SecurInvalidSessionError);
  handleError?(error: ApiError);
}
