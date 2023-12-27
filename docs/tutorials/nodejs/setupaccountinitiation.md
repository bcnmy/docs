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
import { config } from "dotenv";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  DEFAULT_ENTRYPOINT_ADDRESS,
  BiconomySmartAccountV2,
} from "@biconomy/account";
import { Wallet, providers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";

config(); // Load .env variables
```

### Smart Account Creation

Now, let's create a smart account:

#### Setting Up the Wallet

Generate an Ethereum wallet (Ethers) instance:

```typescript
const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai",
);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
```

:::caution
**Security Alert**: Keep your private key secure and confidential.
:::

#### Initializing Bundler and Paymaster

Configure the bundler and paymaster for transaction facilitation:

```typescript
const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80001/Tpk8nuCUd.70bd3a7f-a368-4e5a-af14-80c7f1fcda1a",
});
```

#### Creating the ECDSA Module

Set up the ECDSA module for your smart account:

```typescript
const module = await ECDSAOwnershipValidationModule.create({
  signer: wallet,
  moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
});
```

:::tip
**Insight**: The ECDSA module bridges your wallet (EOA) with the smart account for secure transactions.
:::

#### Finalizing Smart Account Creation

Integrate all elements to finalize your smart account:

```typescript
let biconomySmartAccount = await BiconomySmartAccountV2.create({
  chainId: ChainId.POLYGON_MUMBAI,
  bundler: bundler,
  paymaster: paymaster,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  defaultValidationModule: module,
  activeValidationModule: module,
});

console.log(
  "Smart Account Address: ",
  await biconomySmartAccount.getAccountAddress(),
);
```

:::note
**Important**: This process concludes the smart account creation. It connects the account with the designated wallet and modules.
:::

:::info
**Did You Know?** 🤔 The contract for your smart account is **not yet deployed** at this stage. Thanks to counterfactual address generation, you can know the address beforehand. This address is derived from the module and parameters used during creation—specifically, the signer in this case.
:::

Run this script, and your command prompt will show your smart account's address, marking the successful setup and initialization.
