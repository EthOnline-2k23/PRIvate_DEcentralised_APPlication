import {
    ClaimType,
    AuthType,
    SignatureRequest,
    AuthRequest,
    ClaimRequest,
    SismoConnectConfig,
  } from "@sismo-core/sismo-connect-client";
  
  export { ClaimType, AuthType };
  export const CONFIG: SismoConnectConfig = {
    appId: "0xe9a29cf1a4af6f20d19f0bc28bd3bb05",
    // vault: {
    //   // For development purposes insert the Data Sources that you want to impersonate
    //   // Never use this in production
    //   impersonate: [
    //     // EVM Data Sources
    //     "dhadrien.sismo.eth",
    //     "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
    //     "0x1b9424ed517f7700e7368e34a9743295a225d889",
    //     "0x82fbed074f62386ed43bb816f748e8817bf46ff7",
    //     "0xc281bd4db5bf94f02a8525dca954db3895685700",
    //     // Github Data Source
    //     "github:dhadrien",
    //     // Twitter Data Source
    //     "twitter:dhadrien_",
    //     // Telegram Data Source
    //     "telegram:dhadrien",
    //   ],
    // },
    // displayRawResponse: true, // this enables you to get access directly to the
    // Sismo Connect Response in the vault instead of redirecting back to the app
  };
  
  // Request users to prove ownership of a Data Source (Wallet, Twitter, Github, Telegram, etc.)
  export const AUTHS: AuthRequest[] = [
    // Anonymous identifier of the vault for this app
    // vaultId = hash(vaultSecret, appId).
    // full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
    { authType: AuthType.EVM_ACCOUNT , userId: "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38"},
    // { authType: AuthType.TWITTER, isOptional: true },
    // { authType: AuthType.TELEGRAM, userId: "875608110", isOptional: true },
  ];
  
  // Request users to sign a message
  export const SIGNATURE_REQUEST: SignatureRequest = {
    message: "I don't love Sismo!",
    isSelectableByUser: true,
  };
  