---
sidebar_label: "Setup and Account Initiation"
sidebar_position: 1
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Environment and Smart Account Setup

## 🛠️ Environment Set Up

Before diving in, make sure your development environment is properly configured. If you're already done with the quick start guide, jump ahead to initializing your Smart Account.

### Cloning the Project

Start by cloning a pre-configured Node.js project:

1. Open your CLI (Command Line Interface).
2. Navigate to your desired directory.
3. Clone the repository:

<Tabs>
<TabItem value="http" label="HTTP">

```bash
git clone https://github.com/bcnmy/quickstart.git
```

</TabItem>
<TabItem value="ssh" label="SSH">

```bash
git clone git@github.com:bcnmy/quickstart.git
```

</TabItem>
</Tabs>

### Installing Dependencies

Next, install all necessary dependencies:

<Tabs>
<TabItem value="yarn" label="Yarn">

```bash
yarn install
yarn dev
```

</TabItem>
<TabItem value="npm" label="Npm">

```bash
npm install
npm run dev
```

</TabItem>
</Tabs>

### Environment Variables

Create a `.env` file at the root of your project:

```bash
PRIVATE_KEY = "<your_private_key>"
```

## 🚀 Initialize Smart Account

### Importing Packages

Prepare by organizing all necessary imports:

```typescript
// Import necessary modules and configurations
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import { IBundler, Bundler } from "@biconomy/bundler"; // Biconomy bundler for managing gasless transactions
import {
  DEFAULT_ENTRYPOINT_ADDRESS,
  BiconomySmartAccountV2,
} from "@biconomy/account"; // Default entry point and smart account module from Biconomy
import { Wallet, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster"; // Paymaster interface and Biconomy implementation
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules"; // Modules for ownership validation

config(); // Load environment variables from .env file
```

### Smart Account Creation

Now, let's create a smart account:

#### Setting Up the Wallet

Generate an Ethereum wallet (Ethers) instance:

```typescript
// Set up the Ethereum provider and wallet
const provider = new providers.JsonRpcProvider(
  "https://rpc-amoy.polygon.technology/" // JSON-RPC provider URL for the Polygon Amoy test network
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider); // Creating a wallet instance with a private key from environment variables
```

:::caution
**Security Alert**: Keep your private key secure and confidential.
:::

#### Initializing Bundler and Paymaster

- **Bundlers:** Special nodes that bundle user operations into single transactions for smart contract accounts. They monitor an alternative mempool, execute transactions using their EOAs, and cover the initial gas fee.
- **Paymasters:** Smart contracts enabling flexible gas policies, such as sponsoring operations or accepting ERC-20 tokens for gas fees. They work with bundlers and entry point contracts to manage gas fee transactions​​​​​.

Configure the bundler and paymaster for transaction facilitation:

```typescript
// Configure the Biconomy Bundler
const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80002/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44", // URL to the Biconomy bundler service
  chainId: 80002, // Chain ID for Polygon Amoy test network
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address for the bundler
});

// Configure the Biconomy Paymaster
const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80002/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a", // URL to the Biconomy paymaster service
});
```

#### Creating the ECDSA Module

**ECDSA Validation Module:** Allows EOAs to authorize signing user operations for a Smart Account, resembling a traditional ownership system. Compatible with EIP-1271, it enables Smart Accounts to sign Ethereum messages for dApps.

Set up the ECDSA module for your smart account:

```typescript
// Function to create a module for ownership validation
async function createModule() {
  return await ECDSAOwnershipValidationModule.create({
    signer: wallet, // The wallet acting as the signer
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE, // Address of the default ECDSA ownership validation module
  });
}
```

:::tip
**Insight**: The ECDSA module bridges your wallet (EOA) with the smart account for secure transactions.
:::

#### Finalizing Smart Account Creation

Integrate all elements to finalize your smart account:

```typescript
// Function to create a Biconomy Smart Account
async function createSmartAccount() {
  const module = await createModule(); // Create the validation module

  let smartAccount = await BiconomySmartAccountV2.create({
    chainId: 80002, // Chain ID for the Polygon Amoy network
    bundler: bundler, // The configured bundler instance
    paymaster: paymaster, // The configured paymaster instance
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address
    defaultValidationModule: module, // The default validation module
    activeValidationModule: module, // The active validation module
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress() // Logging the address of the created smart account
  );
  return smartAccount;
}

createSmartAccount(); // Execute the function to create a smart account
```

:::note
**Important**: This process concludes the smart account creation. It connects the account with the designated wallet and modules.
:::

:::info
The contract for your smart account is **not yet deployed** at this stage. Thanks to counterfactual address generation, you can know the address beforehand. This address is derived from the module and parameters used during creation specifically, the **signer** in this case.
:::

:::note
Note that the smart account will be deployed with the first transaction
:::

Run this script, and your command prompt will show your **smart account's address**, marking the successful setup and initialization.

<details>
  <summary> Click to view final code </summary>

```typescript
// Import necessary modules and configurations
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import { IBundler, Bundler } from "@biconomy/bundler"; // Biconomy bundler for managing gasless transactions
import {
  DEFAULT_ENTRYPOINT_ADDRESS,
  BiconomySmartAccountV2,
} from "@biconomy/account"; // Default entry point and smart account module from Biconomy
import { Wallet, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster"; // Paymaster interface and Biconomy implementation
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules"; // Modules for ownership validation

config(); // Load environment variables from .env file

// Set up the Ethereum provider and wallet
const provider = new providers.JsonRpcProvider(
  "https://rpc-amoy.polygon.technology/" // JSON-RPC provider URL for the Polygon Amoy test network
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider); // Creating a wallet instance with a private key from environment variables

// Configure the Biconomy Bundler
const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80002/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44", // URL to the Biconomy bundler service
  chainId: 80002, // Chain ID for Polygon Amoy test network
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address for the bundler
});

// Configure the Paymaster
const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80002/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a", // URL to the Biconomy paymaster service
});

// Function to create a module for ownership validation
async function createModule() {
  return await ECDSAOwnershipValidationModule.create({
    signer: wallet, // The wallet acting as the signer
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE, // Address of the default ECDSA ownership validation module
  });
}

// Function to create a Biconomy Smart Account
async function createSmartAccount() {
  const module = await createModule(); // Create the validation module

  let smartAccount = await BiconomySmartAccountV2.create({
    chainId: 80002, // Chain ID for the Polygon Amoy network
    bundler: bundler, // The configured bundler instance
    paymaster: paymaster, // The configured paymaster instance
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address
    defaultValidationModule: module, // The default validation module
    activeValidationModule: module, // The active validation module
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress() // Logging the address of the created smart account
  );
  return smartAccount;
}

createSmartAccount(); // Execute the function to create a smart account
```

</details>
