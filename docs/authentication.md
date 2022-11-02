# Authentication

## Login

### Request

```
POST /account/auth/login
{
  "email": "admin@admin.com",
  "password": "123456"
}
```

### Response

```json
{
  "accessToken": "...", // jwt
  "refreshToken": "..."
}
```

## Token and refresh token strategy

Access token must be used on all protected endpoint using the `Authorization` key on header.

It has a short lifetime. So you will need to request a new access token when it has expired:

### Request

```
POST /account/auth/refresh-token
{
  "refresh_token": "token"
}
```

### Response

```json
{
  "accessToken": "...", // jwt
  "refreshToken": "..."
}
```

You will receive new pairs of access and refresh tokens.

> Warning: If you send one expired `refresh_token` all a access_token will be revoked for security reasons.

### Links

- https://fusebit.io/blog/refresh-tokens-security/
