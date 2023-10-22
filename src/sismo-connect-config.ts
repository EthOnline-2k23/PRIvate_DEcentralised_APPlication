import {
  ClaimType,
  AuthType,
  SignatureRequest,
  AuthRequest,
  ClaimRequest,
  SismoConnectConfig,
} from '@sismo-core/sismo-connect-client'

export { ClaimType, AuthType }
export const CONFIG: SismoConnectConfig = {
  appId: '0xe9a29cf1a4af6f20d19f0bc28bd3bb05',
}

// Request users to prove ownership of a Data Source (Wallet, Twitter, Github, Telegram, etc.)
export const AUTHS: AuthRequest[] = [
  // Anonymous identifier of the vault for this app
  // vaultId = hash(vaultSecret, appId).
  // full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
  { authType: AuthType.EVM_ACCOUNT, userId: '0xA4C94A6091545e40fc9c3E0982AEc8942E282F38' },
  // { authType: AuthType.TWITTER, isOptional: true },
  // { authType: AuthType.TELEGRAM, userId: "875608110", isOptional: true },
]
// Request users to sign a message
export const SIGNATURE_REQUEST: SignatureRequest = {
  message: "I don't love Sismo!",
  isSelectableByUser: true,
}
console.log(process.env.NEXT_PUBLIC_COMETH_CHAIN)
