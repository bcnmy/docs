---
sidebar_label: "Quickstart"
sidebar_position: 2
---

# Quickstart: Smart Account ⚡️

In this guide, we will create a smart account and mint an NFT. Check out the full code at the end.

:::info
Please note that this tutorial assumes you have Node.js installed and have working knowledge of it. 🧠
:::

## 1. Environment set up 🛠️

We will clone a preconfigured Node.js project to get started. 

```bash
git clone https://github.com/bcnmy/quickstart.git
```

Install all dependencies. In this tutorial, we will use `yarn`.

```bash
yarn install
yarn dev
```

You should see the printed statement `Hello World!` in your terminal.

All packages you need for this guide are already installed. Check out the `package.json` file if you want to explore the dependencies.

> The **Account package** will help you with creating **Smart Account** and an interface with them to send transactions.
The same package can be used to also import the paymaster and bundler.

## 2. Create a smart account 🌟

The **Externally Owned Account (EOA)** corresponding to the private key will serve as the owner of the Smart Account we create. You can get the private key from wallets like MetaMask, TrustWallet, Coinbase Wallet, etc. 🔑

Copy the following code in `src/index.ts` and replace the `PRIVATE_KEY`.

> Be sure to never expose your private key publicly. If possible, store it using an environment variable.

```ts
import { Hex, createWalletClient, encodeFunctionData, http, parseAbi, zeroAddress} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { createSmartAccountClient} from "@biconomy/account";

export const createAccountAndMintNft = async () => {
  // ----- 1. Generate EOA from private key
  const account = privateKeyToAccount("PRIVATE_KEY");
  const client = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http(),
  });
  const eoa = client.account.address;
  console.log(`EOA address: ${eoa}`);

  // ------ 2. Create biconomy smart account instance
  const smartAccount = await createSmartAccountClient({
    signer: client,
    bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  });
  const scwAddress = await smartAccount.getAccountAddress();
  console.log("SCW Address", scwAddress);

};
createAccountAndMintNft();

```

After updating the code, you should see EOA and the smart account address in the console.

Smart accounts are designed with a pre-determined address known prior to deployment. Users transfer funds to this address and then the actual deployment transaction is internally batched with the first transaction that is done by that smart Account. Additionally, the paymaster can be used for this to sponsor this transaction.


:::caution
Before continuing, now that we have our Smart Account address, we need to fund it with some test network tokens! Since we are using the Polygon Mumbai network head over to the [Polygon Faucet](https://faucet.polygon.technology/), paste in your smart account address, and get some test tokens! If you skip this step, you might run into the [AA21 didn't pay prefund error](/troubleshooting/commonerrors.md)! 💸
:::

Once you have tokens available, follow the next steps.

## 3. Execute your first transaction 🚀 

Let's create your first transaction

- `to`: The address towards which this interaction is directed.
- `data`: For the mint function we will pass the `nftData` created using `encodeFunctionData`.
- `value`: For the mint function this won't be needed. Depending on the transaction, you can pass the value.

Add the following code in the script above in the same function.

```typescript
try {
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";
    const parsedAbi = parseAbi(["function safeMint(address _to)"]);
    const nftData = encodeFunctionData({
      abi: parsedAbi,
      functionName: "safeMint",
      args: [scwAddress as Hex],
  });

  // ------ 4. Send transaction
  const transactionResponse = await smartAccount.sendTransaction(
    {
      to: nftAddress,
      data: nftData,
    }
  );
  const { transactionHash } = await transactionResponse.waitForTxHash();
  const userOpReceipt = await transactionResponse.wait();
  console.log("transactionHash", transactionHash, userOpReceipt);
} catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Transaction Error:", error.message);
    }
}
```

1. We create a transaction object.
2. We send the `transaction` to our bundler.
3. We save the response in a variable called `transactionResponse`.
4. We retrieve the transaction detail by calling `userOpResponse.waitForTxHash()`.

_To wait for a specific number of network confirmations before getting the value, use `wait()` with a number argument.
For instance, `transactionResponse.wait(5)` waits for 5 confirmations before returning the value._

Check out the long transaction details available now in your console! You just created and executed your first UserOps using the Biconomy SDK!

Well done! The entire Biconomy crew is sending you a big round of applause! 👏👏🏻👏🏼👏🏽👏🏾👏🏿

<details>
  <summary>View Complete Code</summary>

```typescript
import { Hex, createWalletClient, encodeFunctionData, http, parseAbi, zeroAddress} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { createSmartAccountClient} from "@biconomy/account";

export const createAccountAndMintNft = async () => {
  // ----- 1. Generate EOA from private key
  const account = privateKeyToAccount("PRIVATE_KEY);
  const client = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http(),
  });
  const eoa = client.account.address;
  console.log(`EOA address: ${eoa}`);

  // ------ 2. Create biconomy smart account instance
  const smartAccount = await createSmartAccountClient({
    signer: client,
    bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  });
  const scwAddress = await smartAccount.getAccountAddress();
  console.log("SCW Address", scwAddress);

  try {
    const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";
    const parsedAbi = parseAbi(["function safeMint(address _to)"]);
    const nftData = encodeFunctionData({
      abi: parsedAbi,
      functionName: "safeMint",
      args: [scwAddress as Hex],
    });

    // ------ 4. Send transaction
    const transactionResponse = await smartAccount.sendTransaction(
      {
        to: nftAddress,
        data: nftData,
      }
    );
    const { transactionHash } = await transactionResponse.waitForTxHash();
    const userOpReceipt = await transactionResponse.wait();
    console.log("transactionHash", transactionHash, userOpReceipt);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Transaction Error:", error.message);
    }
  }
};

createAccountAndMintNft();
```

</details>
If you are facing any error, check out [troubleshooting](/troubleshooting/commonerrors) for common errors.

🎉 **Congratulations on completing the quickstart!**

To dive deeper, check out more [use cases](/account/transactions) and follow [this guide for gasless transactions](/account/transactions/gasless).
