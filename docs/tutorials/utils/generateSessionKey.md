# danSDK.generateSessionKey()

## Description

The `generateSessionKey` function is used to generate a new session key from our The Delegated Authorisation Network [(DAN)](https://www.biconomy.io/post/introducing-dan-the-programmable-authorisation-network-for-ai-agents). This key is used under the hood of our sessions offering and is used to validate user operations without the user's direct involvement. Can be used later with the [`signMessage()` helper](./signMessage) to send userOps.

## Parameters

```ts
export type DanSessionKeyRequestParams = {
  /**  Relevant smart account */
  smartAccountClient: BiconomySmartAccountV2;
  /** Optional browser wallet. If using wagmi can be set to connector.getProvider() from useAccount hook */
  browserWallet?: IBrowserWallet;
  /** Optional hardcoded values if required */
  hardcodedValues?: Partial<DanModuleInfo>;
  /** Optional duration of the session key in seconds. Default is 3600 seconds. */
  duration?: number;
  /** Optional chainId. Will be inferred if left unset. */
  chainId?: number;
}
```

## Returns

```ts
export type DanSessionKeyPayload = {
  /** Dan Session ephemeral key*/
  sessionKeyEOA: Hex;
  /** Dan Session MPC key ID*/
  mpcKeyId: string;
  /** Dan Session ephemeral private key without 0x prefi x*/
  hexEphSKWithout0x: string;
  /** Number of nodes that participate in keygen operation. Also known as n. */
  partiesNumber: number;
  /** Number of nodes that needs to participate in protocol in order to generate valid signature. Also known as t. */
  threshold: number;
  /** The eoa that was used to create the session */
  eoaAddress: Hex;
  /** the chainId is relevant only to the */
  chainId: number
}
```

## Example

```ts
import { danSDK } from "@biconomy/account";

const smartAccount = await createSmartAccountClient({
  signer: walletClient,
  bundlerUrl: "", // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
  biconomyPaymasterApiKey: "", // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
});

const sessionKeyPayload = await danSDK.generateSessionKey({ smartAccountClient: smartAccount });

console.log(sessionKeyPayload.sessionKeyEOA) // "0x..."
```