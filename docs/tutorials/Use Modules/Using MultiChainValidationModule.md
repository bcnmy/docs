---
sidebar_label: "Use MultiChainValidation module"
sidebar_position: 2
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

### Overview

This tutorial demonstrates how to use the Biconomy Smart Account with the multi-chain validation module to send user operations on two different chains. The provided code includes generating the External Owned Account (EOA), creating multiple Biconomy Smart Account instances, generating transaction data, building user operations, signing and sending them on different chains.

### Prerequisites

- Node.js installed on your machine
- Biconomy Paymaster API keys for 
- Biconomy Bundler URLs for each chain

### Step 1: Generate EOAs and Create Biconomy Smart Account Instances

<Tabs>
  <TabItem value="viem" label="viem">
  
  ```typescript
  const account = privateKeyToAccount(config.privateKey as Hex);
  const client = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http(),
  });

  // Create multi-chain validation module
  const multiChainModule = await createMultiChainValidationModule({
    signer: client,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE
  });

  // Create Biconomy Smart Account instance for chain 80001
  const smartWallet1 = await createSmartAccountClient({
    bundlerUrl: config.mumbaiBundlerUrl,
    biconomyPaymasterApiKey: config.biconomyPaymasterApiKeyMumbai,
    defaultValidationModule: multiChainModule,
    activeValidationModule: multiChainModule
  });

  // Create Biconomy Smart Account instance for chain 84531
  const smartWallet2 = await createSmartAccountClient({
    bundlerUrl: config.baseBundlerUrl,
    biconomyPaymasterApiKey: config.biconomyPaymasterApiKeyBase,
    defaultValidationModule: multiChainModule,
    activeValidationModule: multiChainModule
  });
  ```

  </TabItem>

  <TabItem value="ethers" label="ethers">
  
  ```typescript
  let provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  let signer = new ethers.Wallet(config.privateKey, provider);

  // Create multi-chain validation module
  const multiChainModule = await createMultiChainValidationModule({
    signer,
    moduleAddress: DEFAULT_MULTICHAIN_MODULE
  });

  // Create Biconomy Smart Account instance for chain 80001
  const smartWallet1 = await createSmartAccountClient({
    bundlerUrl: config.mumbaiBundlerUrl,
    biconomyPaymasterApiKey: config.biconomyPaymasterApiKeyMumbai,
    defaultValidationModule: multiChainModule,
    activeValidationModule: multiChainModule
  });

  // Create Biconomy Smart Account instance for chain 84531
  const smartWallet2 = await createSmartAccountClient({
    bundlerUrl: config.baseBundlerUrl,
    biconomyPaymasterApiKey: config.biconomyPaymasterApiKeyBase,
    defaultValidationModule: multiChainModule,
    activeValidationModule: multiChainModule
  });
  ```

  </TabItem>
</Tabs>

Generate EOAs and create Biconomy Smart Account instances for both chains (80001 and 84531) using the multi-chain validation module.

### Step 2: Generate Transaction Data

```typescript
const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e"; // same address for both chains
const parsedAbi = parseAbi(["function safeMint(address _to)"]);

const txData = encodeFunctionData({
  abi: parsedAbi,
  functionName: "safeMint",
  args: ["0x1234"], // replace this with a recipient address
});
```

Generate transaction data for both Biconomy Smart Account instances to mint NFTs.

### Step 3: Build User Operations and Sign

```typescript
let userOp1 = await smartWallet1.buildUserOp([
  {
    to: nftAddress,
    data: txData,
  },
], { paymasterServiceData: { mode: PaymasterMode.SPONSORED } });

let userOp2 = await smartWallet2.buildUserOp([
  {
    to: nftAddress,
    data: txData,
  },
], { paymasterServiceData: { mode: PaymasterMode.SPONSORED } });

const returnedOps = await multiChainModule.signUserOps([
  { userOp: userOp1, chainId: 80001 },
  { userOp: userOp2, chainId: 84531 },
]);
```

Build user operations for both Biconomy Smart Account instances and sign them using the multi-chain validation module.

### Step 4: Send Signed User Operations

```typescript
try {
  const tx1 = await smartWallet1.sendSignedUserOp(returnedOps[0]);
  const { transactionHash: transactionHash1 } = await tx1.waitForTxHash();
  console.log("Transaction Hash 1", transactionHash1);
} catch (e) {
  console.log("Error received for Chain 80001", e);
}

try {
  const tx2 = await smartWallet2.sendSignedUserOp(returnedOps[1]);
  const { transactionHash: transactionHash2 } = await tx2.waitForTxHash();
  console.log("Transaction Hash 2", transactionHash2);
} catch (e) {
  console.log("Error received for Chain 84531", e);
}
```

Send signed user operations on both chains using the respective Biconomy Smart Account instances and wait for transaction hashes.

That's it! You've successfully sent user operations on two different chains using the Biconomy Smart Account with the multi-chain validation module. Feel free to customize this example based on your specific use case.