# Secur Client for NodeJS
Alliance Secur client lib for nodejs applications

## Getting started
Getting started with Secur Client for nodejs applications is pretty straightforward. <br>
First, you have to init the `SecurClient` and call the `loginWithToken` method if you wish to authenticate
a request.

```javascript
import { SecurClient, SecurUserDetailsService } from "secur-node"

// Here you specify the authentication server.
// Learn more in the "Authentication Flow" section
SecurClient.init({
    protocol: "http",
    host: "localhost",
    port: 3333,
    path: "/"
})
```

## Authentication Flow
When logging in a user, the endpoint /member/@me is called. This endpoint is built up using the provided host information
via config. In the end, the url that will be called can look something like this:
```
http://localhost:3333/
```
Using the loginWithToken() method, an axios request is sent. You just provide the desired token and it will be part of the requests payload. <br>
The endpoint that is called needs to parse the `Authorization` header in order to receive the token on requests. This header will look like this:
```
Authorization: Bearer <TOKEN>
```

## Using with Alliance REST Lib
The Alliance REST library provides some key functionality for rest api developers to make their code a bit more maintainable (there are better "frameworks"). <br>
Alliance REST provides a router called `TSRouter`. You normally provide this router a `UserDetailsService` implementation, so requests can be automatically authorized. <br>
The Secur Client library comes with such an implementation, so that you only have to reference it.
```javascript
import { TSRouter } from "alliance-rest";
import { SecurUserDetailsService } from "secur-node"

// Initialize Router and set authorization service
const router = TSRouter.createInstance(expressApp, ROUTES);
router.setUserDetailsService(new SecurUserDetailsService());
```

## Error Handling
The SecurClient is built upon the Promise API, therefor catching errors is as easy as calling `.catch` on methods.
Here is a table with ApiError objects (from AllianceSDK) that can be thrown if errors occur (excluding default JS errors):
| Error Class               | Status Code       | Error Code               | Description |
|:--------------------------|:------------------|:-------------------------|:------------|
| SecurAccountNotFoundError | 404               | SECUR_ACCOUNT_MISSING    | This is thrown if the account is not found
| SecurInvalidSessionError  | 403               | SECUR_INVALID_SESSION    | This is thrown if there is an invalid session token
| SecurUnauthorizedError    | 403               | SECUR_UNAUTHORIZED_ERROR | This is thrown if the requested route requires authentication but the authorization process failed
| SecurSessionExpiredError  | 403               | SECUR_SESSION_EXPIRED    | This is throw if the token was valid, but the request is still denied