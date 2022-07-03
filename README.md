# Expo Apple Authentication Demo

```
yarn
&&
yarn start
```

## AppleId Profile

```
{
    identitityToken: <JWT token containing AppleId email>,
    email: <AppleId email>,
    user: <UUID string>,
    realUserStatus: int,
    authorizationCode: string,
    fullName:{
        namePrefix: string | null,
        givenName: <firstname>,
        familyName: <lastname>,
        nickname: string | null,
        middleName: string | null,
        nameSuffix: string | null
    },
    state: null
}
```

We care about 4 fields that get returned:

- identityToken - A JWT token that stores information about the audience, issuer and user.

- email - The user's email, used for the backend to create a user account

- user - this is a stable unique identifier that will persist between app versions/device changes for the app.

- fullName - The user's name object, includes family name, given name, nickname etc.

**Warning!**

The `email` and `fullName` will only be populated ONCE. The first time they press the button, this applies even if they change their device or update the app. A user's email is still available in the JWT token, but once `fullName` gets pulled down the first time, you can never request it again and subsequent requests will return null.

## Storing Profile

As `email` and `fullName` are only available on first signin, user profile is persisted to `expo-secure-store`.

## JWT Verification

JWT signature can be verified using Apple keys:

https://appleid.apple.com/auth/keys

## Revoking Credentials

Signin with Apple credentials can be revoked by going to `Settings` -> `Password & Security` -> `Apps Using Apple ID`

https://developer.apple.com/documentation/sign_in_with_apple/revoke_tokens

or

https://appleid.apple.com

identityToken

```
{
    "iss": "https://appleid.apple.com",
    "aud": "host.exp.Exponent",
    "exp": number,
    "iat": number,
    "sub": string,
    "c_hash": string,
    "email": string,
    "email_verified": "booleanString",
    "auth_time": number,
    "nonce_supported": boolean
}
```

```
iss

The issuer registered claim identifies the principal that issued the client secret. Since the client secret belongs to your developer team, use your 10-character Team ID associated with your developer account.

aud

The audience registered claim identifies the intended recipient of the client secret. Since the client secret is sent to the validation server, use https://appleid.apple.com.

exp

The expiration time registered claim identifies the time on or after which the client secret expires. The value must not be greater than 15777000 (6 months in seconds) from the Current UNIX Time on the server.

iat

The issued at registered claim indicates the time at which you generated the client secret, in terms of the number of seconds since Epoch, in UTC.

sub

The subject registered claim identifies the principal that is the subject of the client secret. Since this client secret is meant for your application, use the same value as client_id. The value is case-sensitive.
```

Notes

https://dev.to/bendix/implementing-sign-in-with-apple-with-a-managed-expo-workflow-and-a-nest-js-backend-8ja
