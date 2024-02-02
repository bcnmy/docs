---
sidebar_label: "Creating Gasless Transactions"
sidebar_position: 2
---

# Creating Gasless Transactions ⛽️

Here, we'll guide you through a Node.js script in TypeScript to mint NFTs **without any gas fees** on the Polygon Mumbai.

:::info Prerequisites
Before you dive in, please make sure you've covered [Environment Setup and Account Initialization](setupaccountinitiation). We'll be using the NFT contract [here](https://mumbai.polygonscan.com/address/0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e).
Contract Address: `0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e`.
:::

## 🔄 Updated Imports for Gasless NFT Transactions

We've added new imports to our existing setup for gasless NFT minting:

- **`ethers`**: Essential for specific Ethereum contract functions, such as encoding NFT minting data.
- **`PaymasterMode`**: This defines how the Paymaster handles gas fees, enabling gasless transactions by setting it to `SPONSORED`.

```typescript
// Import necessary modules and configurations
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import {
  createSmartAccountClient,
  PaymasterMode
} from "@biconomy/account"; // Default entry point and smart account module from Biconomy
import { Wallet, ethers, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain

config(); // Load environment variables from .env file
```

## 🛠 Building the NFT Mint Function

We'll build the mintNFT function in a step-by-step manner for clarity.

### Step 1: Initialize the Smart Account

```typescript
async function mintNFT() {
  // Create and initialize the smart account
  const smartAccount = await createSmartAccount();
  // Retrieve the address of the initialized smart account
  const address = await smartAccount.getAccountAddress();
  // ...[continuing the function]...
}
```

- **`createSmartAccount()`**: This custom function creates and initializes your Smart Account.
- **`getAccountAddress()`**: Retrieves the address of your newly minted Smart Account.

### Step 2: Create the NFT Contract Interface

```typescript
// Define the interface for interacting with the NFT contract
const nftInterface = new ethers.utils.Interface([
  "function safeMint(address _to)",
]);
```

- **`Interface` from `ethers`**: This utility helps us interact with our NFT contract.

### Step 3: Encode Function Data

```typescript
// Encode the data for the 'safeMint' function call with the smart account address
const data = nftInterface.encodeFunctionData("safeMint", [address]);
```

- **`encodeFunctionData`**: Packs your function call into a transaction, targeting the `safeMint` function.

## 🧱 Constructing the UserOp

Now, let's assemble the User Operation (UserOp) for our gasless transaction:

### Step 1: Declare Contract Address and Build Transaction

```typescript
// Specify the address of the NFT contract
const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

// Define the transaction to be sent to the NFT contract
const transaction = {
  to: nftAddress,
  data: data,
};
```

- **Contract Address**: Where our NFT lives.
- **Transaction**: The action we're preparing to execute.

## 🌟 Send the transaction with Paymaster

Time to mint that NFT! 🖼️

```typescript
// Try to execute the UserOp and handle any errors
try {
  // Send the transaction through the smart account
  const userOpResponse = await smartAccount.sendTransaction(transaction, {paymasterServiceData: {
    mode: PaymasterMode.SPONSORED
  }});
  // Wait for the transaction to complete and retrieve details
  const transactionDetails = await userOpResponse.wait();
  // Log the transaction details URL and the URL to view minted NFTs
  console.log(`View Minted NFTs: https://testnets.opensea.io/${address}`);
  console.log(
    `Transaction Details: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`,
  );
} catch (e) {
  // Log any errors encountered during the transaction
  console.log("Error encountered: ", e);
}
```

- **`sendTransaction`**: Sends our prepared transaction and converts it into a userOp behind the scenes.
- **`wait`**: Awaits the transaction confirmation.
- **Result**: Outputs links to view the transaction and the minted NFT.

<details>
  <summary>📝 Click to view the complete mintNFT function</summary>

And that's it! You've successfully executed a gasless NFT minting transaction. 🚀💡

```typescript
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
    const userOpResponse = await smartAccount.sendTransaction(transaction, {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
      },
    });
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
```

</details>

And that's it! You've successfully executed a gasless NFT minting transaction. 🚀💡

<details>
  <summary>📝 Click to view the complete</summary>

```typescript
// Import necessary modules and configurations
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

const bundlerUrl = "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44"

// Function to create a Biconomy Smart Account
async function createSmartAccount() {
  let smartAccount = await createSmartAccountClient({
    signer: wallet, // The configured wallet signer
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
    const userOpResponse = await smartAccount.sendTransaction(transaction, {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
      },
    });
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

mintNFT(); // Call mintNFT function
```

</details>
