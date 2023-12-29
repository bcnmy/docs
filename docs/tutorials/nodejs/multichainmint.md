---
sidebar_label: "Multichain NFT Mint"
sidebar_position: 5
---

# Mint Your NFT on Multiple Chains with One Signature 🌍✍️

Transitioning to multichain opens up exciting possibilities.

In this guide, we'll start from scratch to enable minting an NFT on multiple chains, specifically **Polygon Mumbai** and **Base test networks**, using just **one signature**.

:::info Supported Chains
Find all supported chains [here](https://docs.biconomy.io/supportedchains/). Our NFT contract has the same address on both Polygon and Base (0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e).

## 🛠️ Initial Setup

### Importing Required Modules

Begin by importing the necessary modules for blockchain interaction and configuration.

```typescript
import { config } from "dotenv";
import { IBundler, Bundler } from "@biconomy/bundler";
import { ChainId } from "@biconomy/core-types";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  MultiChainValidationModule,
  DEFAULT_MULTICHAIN_MODULE,
} from "@biconomy/modules";
import { ethers } from "ethers";
import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";
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

### Configuring Bundler and Paymaster for Networks

Configure the Bundler and Paymaster for both Polygon Mumbai and Base Goerli Testnet.

```typescript
// Configure the Bundler and Paymaster for Polygon Mumbai network
const mumbaiBundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const mumbaiPaymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a",
});

// Configure the Bundler and Paymaster for Base Goerli Testnet
const baseBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.BASE_GOERLI_TESTNET,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const basePaymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/84531/m814QNmpW.fce62d8f-41a1-42d8-9f0d-2c65c10abe9a",
});
```

## 🌐 Creating Multichain Module

### Multichain Validation Module

Create a Multichain Validation Module to enable cross-chain functionality.

```typescript
async function createModule() {
  return await MultiChainValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE,
  });
}
```

### Smart Account Creation for Both Networks

Generate Smart Accounts for Polygon Mumbai and Base Goerli Testnet using the Multichain Module.

```typescript
// Function to create a smart account using the specified chain ID, bundler, and paymaster
async function createSmartAccount(
  chainId: ChainId,
  bundler: IBundler,
  paymaster: IPaymaster,
) {
  const module = await createModule();
  let smartAccount = await BiconomySmartAccountV2.create({
    chainId,
    paymaster,
    bundler,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
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

## 🎨 Minting NFTs on Both Networks

### Setting Up NFT Minting Transactions

Prepare your NFT minting transactions for both networks.

```typescript
async function mintNFT() {
  // Create smart accounts for both Polygon Mumbai and Base Goerli networks
  const mumbaiSmartAccount = await createSmartAccount(
    ChainId.POLYGON_MUMBAI,
    mumbaiBundler,
    mumbaiPaymaster,
  );
  const baseSmartAccount = await createSmartAccount(
    ChainId.BASE_GOERLI_TESTNET,
    baseBundler,
    basePaymaster,
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
    { userOp: partialUserOp, chainId: ChainId.POLYGON_MUMBAI },
    { userOp: partialUserOp2, chainId: ChainId.BASE_GOERLI_TESTNET },
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

Execute the `mintNFT` function to mint NFTs on both **Polygon Mumbai** and **Base Goerli Testnet**, demonstrating the power of Multichain operations.

```typescript
mintNFT();
```

:::tip
Feel free to modify the `mintNFT` function as per your contract's requirements.
:::

Through this setup, you've unlocked the potential to mint NFTs across multiple blockchains. With these capabilities, you can extend your reach across various networks. 🚀💡

<details>
  <summary>📝 Click to view the complete</summary>

```typescript
import { config } from "dotenv";
import { IBundler, Bundler } from "@biconomy/bundler";
import { ChainId } from "@biconomy/core-types";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  MultiChainValidationModule,
  DEFAULT_MULTICHAIN_MODULE,
} from "@biconomy/modules";
import { ethers } from "ethers";
import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";

config();
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai",
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

// Configure the Bundler and Paymaster for Polygon Mumbai network
const mumbaiBundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const mumbaiPaymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a",
});

// Configure the Bundler and Paymaster for Base Goerli Testnet
const baseBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/84531/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.BASE_GOERLI_TESTNET,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const basePaymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/84531/m814QNmpW.fce62d8f-41a1-42d8-9f0d-2c65c10abe9a",
});

async function createModule() {
  return await MultiChainValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE,
  });
}

// Function to create a smart account using the specified chain ID, bundler, and paymaster
async function createSmartAccount(
  chainId: ChainId,
  bundler: IBundler,
  paymaster: IPaymaster,
) {
  const module = await createModule();
  let smartAccount = await BiconomySmartAccountV2.create({
    chainId,
    paymaster,
    bundler,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
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
    ChainId.POLYGON_MUMBAI,
    mumbaiBundler,
    mumbaiPaymaster,
  );
  const baseSmartAccount = await createSmartAccount(
    ChainId.BASE_GOERLI_TESTNET,
    baseBundler,
    basePaymaster,
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
    { userOp: partialUserOp, chainId: ChainId.POLYGON_MUMBAI },
    { userOp: partialUserOp2, chainId: ChainId.BASE_GOERLI_TESTNET },
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
