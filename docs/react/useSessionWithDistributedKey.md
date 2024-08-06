[**@biconomy/use-aa**](./index.md) • **Hook**

---

[@biconomy/use-aa](./index.md) / useSessionWithDistributedKey

:::info 
These hooks are a beta feature and are subject to change. To use this feature use our beta package `@biconomy-devx/use-aa` instead of `@biconomy/use-aa`, add the following bunfig.toml configuration:
```toml
[install.scopes]
silencelaboratories = { token = "$VITE_SILENCE_LABS_NPM_TOKEN", url = "https://registry.npmjs.org" }
```
And obtain the `VITE_SILENCE_LABS_NPM_TOKEN` from our support team, and add it to your .env file.
:::


## Description

Uses a previously created session ([see here](./useCreateSessionWithDistributedKey.md)) which sends transactions in the context of a users smart account.

## Parameters

```ts
type Transaction = {
  to: string;
  value: BigNumberish | string;
  data: string;
};
type UseSessionWithDistributedKeyProps = {
  /** The BuildUserOpOptions options. See https://bcnmy.github.io/biconomy-client-sdk/types/BuildUserOpOptions.html for further detail */
  options?: BuildUserOpOptions;
  /** The whitelisted transaction */
  transactions: Transaction | Transaction[];
  /** The index of the relevant session leaf. Defaults to zero */
  correspondingIndex?: number;
  /** The smart account address to be used for the session. Defaults to the connected smartAccount. */
  smartAccountAddress?: Hex
};
```

## Returns

[userOpReceipt](../../Bundler/api/get-useroperation-receipt#response)

```ts
type UserOpResponse = {
  userOpHash: string;
  wait(_confirmations?: number): Promise<UserOpReceipt>;
  waitForTxHash(): Promise<UserOpStatus>;
};
```

## Example

```tsx
import { useSessionWithDistributedKey, useUserOpWait, Options } from "@biconomy-devx/useAA";
import { polygonAmoy } from "viem/chains";
import { encodeFunctionData, parseAbi } from "wagmi";

export const UseSessionWithDistributedKey = ({ smartAccountAddress }) => {
  const { mutate, data: userOpResponse, error, isPending } = useSessionWithDistributedKey();

  const {
    isLoading: waitIsLoading,
    isSuccess: waitIsSuccess,
    error: waitError,
    data: waitData,
  } = useUserOpWait(userOpResponse);

  const mintTx = () =>
    mutate({
      transactions: {
        to: "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e",
        data: encodeFunctionData({
          abi: parseAbi(["function safeMint(address _to)"]),
          functionName: "safeMint",
          args: [smartAccountAddress],
        }),
      },
      options: Options.Sponsored,
      smartAccountAddress
    });

  useEffect(() => {
    if (waitData?.success === "true") {
      console.log(waitData?.receipt?.transactionHash);
    }
  }, [waitData]);

  return (
    <ErrorGuard errors={[error, waitError]}>
      <Button
        title="Use Distributed Session to Mint"
        onClickFunc={mintTx}
        isLoading={isPending || waitIsLoading}
      />
    </ErrorGuard>
  );
};
```

## Source

[hooks/useSessionWithDistributedKey.ts:87](https://github.com/bcnmy/useAA/blob/main/src/hooks/useSessionWithDistributedKey.ts#L87)
