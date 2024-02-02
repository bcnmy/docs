---
sidebar_label: "Multichain NFT Mint"
sidebar_position: 5
---

# Mint Your NFT on Multiple Chains with One Signature 🌍✍️

Transitioning to multichain opens up exciting possibilities.

In this guide, we'll start from scratch to enable minting an NFT on multiple chains, specifically **Polygon Mumbai** and **Base test networks**, using just **one signature**.

:::info Supported Chains
Find all supported chains [here](https://docs.biconomy.io/supportedchains/). Our NFT contract has the same address on both Polygon and Base (0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e).
:::

## 🛠️ Initial Setup

### Importing Required Modules

Begin by importing the necessary modules for blockchain interaction and configuration.

```typescript
import { config } from "dotenv";
import {
  createSmartAccountClient,
  IBundler,
  IPaymaster
} from "@biconomy/account";
import {
  createMultiChainValidationModule,
  DEFAULT_MULTICHAIN_MODULE,
} from "@biconomy/modules";
import { ethers } from "ethers";
```

### Setting Up Ethereum Provider and Wallet

Establish your Ethereum provider and wallet for interacting with the blockchain.

```typescript
config();
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai",
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
```

Get your bundlerUrls and paymaster Api Keys from the dashboard.

```typescript
const mumbaiBundlerUrl = "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
const mumbaiPaymasterApiKey = "apikey";

const baseBundlerUrl = "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
const basePaymasterApiKey = "apikey";
```

## 🌐 Creating Multichain Module

### Multichain Validation Module

Create a Multichain Validation Module to enable cross-chain functionality.

```typescript
async function createModule() {
  return await createMultiChainValidationModule({
    signer: wallet,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE,
  });
}
```

### Smart Account Creation for Both Networks

Generate Smart Accounts for Polygon Mumbai and Base Goerli Testnet using the Multichain Module.

```typescript
// Function to create a smart account using the specified bundler, and paymaster
async function createSmartAccount(
  bundlerUrl: IBundler,
  paymasterApiKey: IPaymaster,
) {
  const module = await createModule();
  // No need to pass signer if you passed a validation module.
  let smartAccount = await createSmartAccountClient({
    biconomyPaymasterApiKey: paymasterApiKey,
    bundlerUrl,
    defaultValidationModule: module,
    activeValidationModule: module,
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress(),
  );
  return smartAccount;
}
```

:::warning
🚨 Your Smart Account address is counterfactually generated based on the module and parameters used. When switching to multichain module, the address will change while deploying your Smart Account.
:::

## 🌐 Minting NFTs on Multiple Networks

The `mintNFT` function is the core of our multi-chain NFT minting process. Let's break it down to understand its functionality.

### Creating Smart Accounts for Each Network 🛠️

First, we create smart accounts for both networks. Each account is configured with its respective chain ID, bundler, and paymaster.

```typescript
const mumbaiSmartAccount = await createSmartAccount(
  bundlerUrlMumbai,
  mumbaiPaymasterApiKey,
);
const baseSmartAccount = await createSmartAccount(
  baseBundlerUrl,
  basePaymaster,
);
```

### Setting Up the NFT Contract Interface 📜

Next, we define the NFT contract interface and encode the data for the `safeMint` function. This data is crucial for creating our NFT minting transaction.

```typescript
const nftInterface = new ethers.utils.Interface([
  "function safeMint(address _to)",
]);
const data = nftInterface.encodeFunctionData("safeMint", [
  await baseSmartAccount.getAccountAddress(),
]);
```

### Preparing Transactions for Each Network 📦

For each network, we build a user operation (UserOp) for the minting transaction. These operations will later be signed and executed.

```typescript
let partialUserOp = await mumbaiSmartAccount.buildUserOp(
  [{ to: nftAddress, data }],
  { paymasterServiceData: { mode: PaymasterMode.SPONSORED } },
);
let partialUserOp2 = await baseSmartAccount.buildUserOp(
  [{ to: nftAddress, data }],
  { paymasterServiceData: { mode: PaymasterMode.SPONSORED } },
);
```

### Signing Operations for Both Networks ✍️

Using the Multichain Module, we sign the operations for both networks. This step is crucial for validating our transactions across different blockchains.

```typescript
const resolvedOps = await(await createModule()).signUserOps([
  { userOp: partialUserOp, chainId: 80001 },
  { userOp: partialUserOp2, chainId: 84531 },
]);
```

### Executing Transactions on Each Network 🚀

Finally, we execute the signed operations on each network. The function waits for the transaction to complete and logs the transaction details for verification.

```typescript
try {
  const userOpResponse1 = await mumbaiSmartAccount.sendSignedUserOp(
    resolvedOps[0],
  );
  const userOpResponse2 = await baseSmartAccount.sendSignedUserOp(
    resolvedOps[1],
  );

  const transactionDetails1 = await userOpResponse1.wait();
  const transactionDetails2 = await userOpResponse2.wait();
  console.log(
    "Polygon Mumbai Transaction: https://mumbai.polygonscan.com/tx/" +
      transactionDetails1.receipt.transactionHash,
  );
  console.log(
    "Base Goerli Transaction: https://goerli.basescan.org/tx/" +
      transactionDetails2.receipt.transactionHash,
  );
} catch (e) {
  console.log("Error:", e);
}
```

### 🚀 Launching the Mint Function

Trigger the `mintNFT` function to start minting your NFTs on both networks.

```typescript
mintNFT();
```

<details>
  <summary>📝 Click to view the complete mintNFT function</summary>

```typescript
async function mintNFT() {
  // Create smart accounts for both Polygon Mumbai and Base Goerli networks
  const mumbaiSmartAccount = await createSmartAccount(
    mumbaiBundlerUrl,
    mumbaiPaymasterApiKey,
  );
  const baseSmartAccount = await createSmartAccount(
    baseBundlerUrl,
    basePaymasterApiKey,
  );

  // Define the interface for the NFT contract and encode data for the 'safeMint' function
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);
  const data = nftInterface.encodeFunctionData("safeMint", [
    await baseSmartAccount.getAccountAddress(),
  ]);
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  // Build user operations for the Polygon Mumbai network
  let partialUserOp = await mumbaiSmartAccount.buildUserOp(
    [{ to: nftAddress, data }],
    {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    },
  );

  // Build user operations for the Base Goerli network
  let partialUserOp2 = await baseSmartAccount.buildUserOp(
    [{ to: nftAddress, data }],
    {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    },
  );

  // Sign operations for both networks
  const resolvedOps = await (
    await createModule()
  ).signUserOps([
    { userOp: partialUserOp, chainId: 80001 },
    { userOp: partialUserOp2, chainId: 84531 },
  ]);

  // Execute the operations on both networks and log the transaction details
  try {
    const userOpResponse1 = await mumbaiSmartAccount.sendSignedUserOp(
      resolvedOps[0],
    );
    const userOpResponse2 = await baseSmartAccount.sendSignedUserOp(
      resolvedOps[1],
    );

    const transactionDetails1 = await userOpResponse1.wait();
    const transactionDetails2 = await userOpResponse2.wait();
    console.log(
      "Polygon Mumbai Transaction: https://mumbai.polygonscan.com/tx/" +
        transactionDetails1.receipt.transactionHash,
    );
    console.log(
      "Base Goerli Transaction: https://goerli.basescan.org/tx/" +
        transactionDetails2.receipt.transactionHash,
    );
  } catch (e) {
    console.log("Error encountered: ", e);
  }
}
```

</details>

:::tip
Feel free to modify the `mintNFT` function as per your contract's requirements.
:::

Through this setup, you've unlocked the potential to mint NFTs across multiple blockchains. With these capabilities, you can extend your reach across various networks. 🚀💡

<details>
  <summary>📝 Click to view the complete</summary>

```typescript
import { config } from "dotenv";
import {
  createSmartAccountClient,
  PaymasterMode
} from "@biconomy/account";
import {
  createMultiChainValidationModule,
  DEFAULT_MULTICHAIN_MODULE,
} from "@biconomy/modules";
import { ethers } from "ethers";

config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai",
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

const mumbaiBundlerUrl = "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
const mumbaiPaymasterApiKey = "apikey";

const baseBundlerUrl = "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
const basePaymasterApiKey = "apikey";

async function createModule() {
  return await createMultiChainValidationModule({
    signer: wallet,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE,
  });
}

// Function to create a smart account using the specified bundler, and paymaster
async function createSmartAccount(
  bundlerUrl: string,
  paymasterApiKey: string,
) {
  const module = await createModule();
  let smartAccount = await createSmartAccountClient({
    biconomyPaymasterApiKey: paymasterApiKey,
    bundlerUrl,
    defaultValidationModule: module,
    activeValidationModule: module,
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress(),
  );
  return smartAccount;
}

async function mintNFT() {
  // Create smart accounts for both Polygon Mumbai and Base Goerli networks
  const mumbaiSmartAccount = await createSmartAccount(
    mumbaiBundlerUrl,
    mumbaiPaymasterApiKey,
  );
  const baseSmartAccount = await createSmartAccount(
    baseBundlerUrl,
    basePaymasterApiKey,
  );

  // Define the interface for the NFT contract and encode data for the 'safeMint' function
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);
  const data = nftInterface.encodeFunctionData("safeMint", [
    await baseSmartAccount.getAccountAddress(),
  ]);
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  // Build user operations for the Polygon Mumbai network
  let partialUserOp = await mumbaiSmartAccount.buildUserOp(
    [{ to: nftAddress, data }],
    {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    },
  );

  // Build user operations for the Base Goerli network
  let partialUserOp2 = await baseSmartAccount.buildUserOp(
    [{ to: nftAddress, data }],
    {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    },
  );

  // Sign operations for both networks
  const resolvedOps = await (
    await createModule()
  ).signUserOps([
    { userOp: partialUserOp, chainId: 80001 },
    { userOp: partialUserOp2, chainId: 84531 },
  ]);

  // Execute the operations on both networks and log the transaction details
  try {
    const userOpResponse1 = await mumbaiSmartAccount.sendSignedUserOp(
      resolvedOps[0],
    );
    const userOpResponse2 = await baseSmartAccount.sendSignedUserOp(
      resolvedOps[1],
    );

    const transactionDetails1 = await userOpResponse1.wait();
    const transactionDetails2 = await userOpResponse2.wait();
    console.log(
      "Polygon Mumbai Transaction: https://mumbai.polygonscan.com/tx/" +
        transactionDetails1.receipt.transactionHash,
    );
    console.log(
      "Base Goerli Transaction: https://goerli.basescan.org/tx/" +
        transactionDetails2.receipt.transactionHash,
    );
  } catch (e) {
    console.log("Error encountered: ", e);
  }
}

mintNFT();
```

</details>
