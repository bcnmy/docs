---
sidebar_label: "Use SessionKeyManager module"
sidebar_position: 3
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

### Overview

This tutorial demonstrates how to use the Biconomy Smart Account with session keys to store the signer. The provided code includes creating a Biconomy Smart Account, creating a session module, setting an enabled call on the session, and performing a transaction with session validation.

### Prerequisites

- Node.js installed on your machine
- A Biconomy Paymaster API key
- Biconomy Bundler URL

### Step 1: Create Biconomy Smart Account and Session Module

  ```typescript
  // Create smart account
  let smartWallet = await createSmartAccountClient({
    signer: sessionSigner, 
    bundlerUrl,
    biconomyPaymasterApiKey,
  });

  // Create session module
  const sessionModule = await SessionKeyManagerModule.create({
    moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
    smartAccountAddress: await smartWallet.getAddress()
  });
  ```

Create a Biconomy Smart Account and a session module.

### Step 2: Set Enabled Call on Session and Build User Operation

Here we are enabling the session signer to transfer a maximum amount of 10 USDC using this session.

```typescript
// Set enabled call on session
const sessionKeyData = encodeAbiParameters(
  [{ type: "address" }, { type: "address" }, { type: "address" }, { type: "uint256" }],
  [
    sessionKeyEOA,
    "0xdA5289fCAAF71d52a80A254da614a192b693e977", // ERC-20 token address
    recipient, // Receiver address
    parseUnits("10", 6),
  ],
);

const sessionTxData = await sessionModule.createSessionData([
  {
    validUntil: 0,
    validAfter: 0,
    sessionValidationModule: erc20ModuleAddr,
    sessionPublicKey: sessionKeyEOA,
    sessionKeyData: sessionKeyData,
  },
]);

const setSessionAllowedTrx = {
  to: DEFAULT_SESSION_KEY_MANAGER_MODULE,
  data: sessionTxData.data,
};

const txArray: any = [];

// Check if module is enabled
const isEnabled = await smartWallet.isModuleEnabled(DEFAULT_SESSION_KEY_MANAGER_MODULE);
if (!isEnabled) {
  const enableModuleTrx = await smartWallet.getEnableModuleData(DEFAULT_SESSION_KEY_MANAGER_MODULE);
  txArray.push(enableModuleTrx);
  txArray.push(setSessionAllowedTrx);
} else {
  console.log("MODULE ALREADY ENABLED");
  txArray.push(setSessionAllowedTrx);
}
```

Set the enabled call on the session and build a user operation.

### Step 3: Send the transactions

```typescript
const userOpResponse1 = await smartWallet.sendTransaction(txArray);
const transactionDetails = await userOpResponse1.wait();
console.log("Transaction Hash: ", transactionDetails.receipt.transactionHash);

// Perform a transaction with session validation
const encodedCall = encodeFunctionData({
  abi: parseAbi(["function transfer(address _to, uint256 _value)"]),
  functionName: "transfer",
  args: [recipient, parseUnits("1", 6)],
});

const transferTx = {
  to: "0xdA5289fCAAF71d52a80A254da614a192b693e977", // ERC-20 token address
  data: encodedCall,
};

const userOpResponse2 = await smartWallet.sendTransaction(transferTx, {
  params: {
    sessionSigner: sessionSigner,
    sessionValidationModule: erc20ModuleAddr.toLowerCase() as Hex,
  },
  paymasterServiceData: {
    mode: PaymasterMode.SPONSORED,
  },
});
```

That's it! You've successfully used session keys to store the signer and performed a transaction with session validation using the Biconomy Smart Account. Feel free to customize this example based on your specific use case.