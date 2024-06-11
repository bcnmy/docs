[**@biconomy/use-aa**](../index.md) • **Hook**

---

[@biconomy/use-aa](../index.md) / useSendTransaction

## Description

Returns an upper estimate for the gas spent on a specific user operation. This method will fetch an approximate gas estimate for the user operation, given the current state of the network. It is regularly an overestimate, and the actual gas spent will likely be lower. Returns the expected amount of gas in wei for the tx

## Parameters

```ts
type Transaction = {
  to: string;
  value: BigNumberish | string;
  data: string;
};

type UseGasEstimateProps = {
  /** The transactions to be batched. */
  transactions: Transaction | Transaction[];
  /** The BuildUserOpOptions options. See https://bcnmy.github.io/biconomy-client-sdk/types/BuildUserOpOptions.html for further detail */
  options?: BuildUserOpOptions;
};
```

## Payload

bigint

## Example

```tsx
import { useGasEstimate } from "@biconomy/useAA";
import { encodeFunctionData, parseAbi } from "wagmi";

export const GasEstimate = () => {

  const transactions = useMemo(
    () => ({
      to: "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e",
      data: encodeFunctionData({
        abi: parseAbi(["function safeMint(address _to)"]),
        functionName: "safeMint",
        args: [smartAccountAddress as Hex],
      }),
    }),
    [smartAccountAddress]
  );

  const { data: gasInWei, error, isLoading } = useGasEstimate({ transactions });

  return (
    <ErrorGuard errors={[error]}>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            Amount: {gasInWei}
          </div>
        )}
      }</div>
    </ErrorGuard>
  );
};
```

## Source

[hooks/useGasEstimate.ts:79](https://github.com/bcnmy/useAA/blob/main/src/hooks/useGasEstimate.ts)
