[**@biconomy/use-aa**](./index.md) • **Hook**

---

[@biconomy/use-aa](./index.md) / useSmartAccount

## Description

This function will retreive a smart account and associated information from the BiconomyProvider for 'dropping down' to the core SDK

## Returns

```ts
type BiconomyContextPayload = {
  /** The BiconomySmartAccountV2 instance. This can be used to 'drop down' to the core SDK */
  smartAccountClient: BiconomySmartAccountV2 | null;
  /** The Tanstack Query client instance */
  queryClient: QueryClient | undefined;
  /** The address of the smart account for the user */
  smartAccountAddress: Hex;
  /** The URL of the Biconomy bundler. This can be retrieved from the Biconomy dashboard: https://dashboard.biconomy.io */
  bundlerUrl: string;
  /** The paymaster API key. This can be retrieved from the Biconomy dashboard: https://dashboard.biconomy.io */
  paymasterApiKey: string;
};
```

## Source

[hooks/useSmartAccount.ts:7](https://github.com/bcnmy/useAA/blob/main/src/hooks/useSmartAccount.ts#L7)
