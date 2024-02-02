---
sidebar_label: "Batching Multiple Transactions"
sidebar_position: 3
---

# Batching Multiple Transactions 🔄

In this section, we evolve our approach to include **batching**, where we execute **multiple transactions in one go**. This is particularly useful for actions like **minting several NFTs simultaneously**.

## Modifying the `mintNFT` Function for Batching

Let's adjust the `mintNFT` function from our previous guide to enable batching.

### Original Transaction Setup

```typescript
// Single transaction for minting an NFT
const transaction = {
  to: nftAddress,
  data: data,
};
```

### Implementing Batching

```typescript
// Implementing batching by duplicating the transaction
let userOpResponse = await smartAccount.sendTransaction([transaction, transaction], {
  paymasterServiceData: {
    mode: PaymasterMode.SPONSORED,
  },
});
```

:::info
We're being a bit lazy here by duplicating the same transaction 😅.
In practice, you can batch any combination of transactions!
:::

#### Changes Explained

1. **Batched Transactions**: Instead of a single transaction, we now include the same `transaction` twice in the array for `sendTransaction`.These transactions will be built into a user op by the SDK.  

### Benefits of Batching

- **Increased Efficiency 🚀**: Executes several actions in one blockchain operation.
- **Cost-Effective 💸**: Saves on transaction fees compared to executing actions separately.

:::tip
Batching is effective for similar repetitive actions, like minting multiple NFTs for an event. Though we've used the same transaction here for simplicity, you can mix different transactions as needed.
:::

<details>
  <summary>📝 Click to view the complete code</summary>

```typescript
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import {
  createSmartAccountClient,
  PaymasterMode
} from "@biconomy/account"; // Default entry point and smart account module from Biconomy
import { Wallet, ethers, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain

config(); // Load environment variables from .env file

// Set up the Ethereum provider and wallet
const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai", // JSON-RPC provider URL for the Polygon Mumbai test network
);

const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider); // Creating a wallet instance with a private key from environment variables

// Function to create a Biconomy Smart Account
async function createSmartAccount() {
  let smartAccount = await createSmartAccountClient({
    signer: wallet,
    bundlerUrl, // The configured bundler instance
  });

  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress(), // Logging the address of the created smart account
  );

  return smartAccount;
}

// Function to mint an NFT gaslessly
async function mintNFT() {
  // Create and initialize the smart account
  const smartAccount = await createSmartAccount();

  // Retrieve the address of the initialized smart account
  const address = await smartAccount.getAccountAddress();

  // Define the interface for interacting with the NFT contract
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);

  // Encode the data for the 'safeMint' function call with the smart account address
  const data = nftInterface.encodeFunctionData("safeMint", [address]);

  // Specify the address of the NFT contract
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  // Define the transaction to be sent to the NFT contract
  const transaction = {
    to: nftAddress,
    data: data,
  };

  // Try to execute the UserOp and handle any errors
  try {
    // Send the UserOp through the smart account
    const userOpResponse = await smartAccount.sendTransaction(
      [transaction, transaction],
      {
        paymasterServiceData: {
          mode: PaymasterMode.SPONSORED,
        },
      },
    );

    // Wait for the transaction to complete and retrieve details
    const transactionDetails = await userOpResponse.wait();

    // Log the transaction details URL and the URL to view minted NFTs
    console.log(
      `Transaction Details: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`,
    );

    console.log(`View Minted NFTs: https://testnets.opensea.io/${address}`);
  } catch (e) {
    // Log any errors encountered during the transaction
    console.log("Error encountered: ", e);
  }
}

mintNFT();
```

</details>

This approach showcases the practicality of batching in blockchain operations, offering both efficiency and cost savings.🧑‍💻
