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

Inside src/index.ts
```typescript
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import {
  BiconomySmartAccountV2,
  createSmartAccountClient
} from "@biconomy/account"; // Default entry point and smart account module from Biconomy
import { Wallet, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain

config(); // Load environment variables from .env file
```

### Smart Account Creation

Now, let's create a smart account:

#### Setting Up the Wallet

Generate an Ethereum wallet (Ethers) instance:

```typescript
// Set up the Ethereum provider and wallet
const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai", // JSON-RPC provider URL for the Polygon Mumbai test network
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider); // Creating a wallet instance with a private key from environment variables
```

:::caution
**Security Alert**: Keep your private key secure and confidential.
:::

#### Create the Smart Account

Integrate all elements to finalize your smart account:

```typescript
// Function to create a Biconomy Smart Account
async function createSmartAccount() {
  let smartAccount = await createSmartAccountClient({
    signer: wallet
    bundlerUrl, // The configured bundler instance
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress(), // Logging the address of the created smart account
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
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import {
  BiconomySmartAccountV2,
  createSmartAccountClient
} from "@biconomy/account"; // Default entry point and smart account module from Biconomy
import { Wallet, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain

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
    signer: wallet
    bundlerUrl, // The configured bundler instance
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress(), // Logging the address of the created smart account
  );
  return smartAccount;
}

createSmartAccount(); // Execute the function to create a smart account
```

</details>
