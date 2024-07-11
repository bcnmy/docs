# danSDK.signMessage()

## Description

The `signMessage` function is used to sign a message using our The Delegated Authorisation Network [(DAN)](https://www.biconomy.io/post/introducing-dan-the-programmable-authorisation-network-for-ai-agents).

## Parameters

The payload from the [generateSessionKey](./generateSessionKey.md) helper:

```ts
export type DanModuleInfo = {
  /** Ephemeral sk */
  hexEphSKWithout0x: string
  /** eoa address */
  eoaAddress: Hex
  /** threshold */
  threshold: number
  /** parties number */
  partiesNumber: number
  /** userOp to be signed */
  userOperation?: Partial<UserOperationStruct>
  /** chainId */
  chainId: number
  /** selected mpc key id */
  mpcKeyId: string
}
```

## Returns

a signature of type `Hex`

## Example

```ts

import { danSDK } from "@biconomy/account";

const objectToSign: DanSignatureObject = {
  userOperation: UserOperationStruct,
  entryPointVersion: "v0.6.0",
  entryPointAddress: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
  chainId: 80002
}
const messageToSign = JSON.stringify(objectToSign)
const signature: Hex = await danSDK.signMessage(messageToSign, sessionSignerData.danModuleInfo); // From the generateSessionKey helper
```