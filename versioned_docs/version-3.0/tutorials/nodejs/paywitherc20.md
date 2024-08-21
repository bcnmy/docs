---
sidebar_label: "Pay for Gas with ERC20 Tokens"
sidebar_position: 4
---

# Paying for Gas with ERC20 Tokens 🛢️💳

This guide focuses on using ERC20 tokens like USDC to cover gas fees, adding flexibility in handling transaction costs.
For this tutorial you will need some **Test USDC tokens** (**0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31**).

:::info Preparation
Before starting, acquire test USDC tokens. Swap test Matic for USDC on [Uniswap](https://app.uniswap.org/#/swap) connected to the Polygon Amoy network. Obtain test Matic from the [polygon faucet](https://faucet.polygon.technology/). Make sure to swap for Polygon Amoy USDC test tokens at this address:
0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31
:::

User can pay in any ERC20 token of their choice. Please find the supported list of ERC20 tokens [here](https://legacy-docs.biconomy.io/3.0/paymaster/supportedNetworks#erc20-gas-payments).

## 🔄 Updated Imports for paying Gas with ERC20

Let's review the updated imports necessary for this functionality:

- `IHybridPaymaster`, `SponsorUserOperationDto`, `PaymasterFeeQuote` from` @biconomy/paymaster`: These are additional interfaces to support complex paymaster operations. They play crucial roles in enabling ERC20 token payments for gas fees.

```typescript
// Import necessary modules and configurations
import { config } from "dotenv"; // dotenv for loading environment variables
import { IBundler, Bundler } from "@biconomy/bundler"; // Biconomy bundler for gasless transactions
import {
  DEFAULT_ENTRYPOINT_ADDRESS,
  BiconomySmartAccountV2,
} from "@biconomy/account"; // Smart account module
import { Wallet, ethers, providers } from "ethers"; // Ethereum blockchain interactions
import { ChainId } from "@biconomy/core-types"; // Supported blockchain chain IDs
import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterFeeQuote,
} from "@biconomy/paymaster"; // Paymaster interface for ERC20 gas payments
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules"; // Modules for ownership validation
config();
```

### Original Sponsored Paymaster Setup

Initially, the paymaster was set up for sponsored transactions:

```typescript
let partialUserOp = await smartAccount.buildUserOp([transaction, transaction], {
  paymasterServiceData: {
    mode: PaymasterMode.SPONSORED,
  },
});
```

### New ERC20 Token Paymaster Setup

Replace the above code with the following to enable ERC20 token payments:

### Initializing Paymaster for ERC20 Payments

```typescript
// Constructing a UserOp with the transaction details
let partialUserOp = await smartAccount.buildUserOp([transaction]);
```

This step initiates the creation of a User Operation with our NFT transaction.

```typescript
// Setting up the paymaster for ERC20 token payments
const biconomyPaymaster =
  smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
```

The paymaster is configured to handle the logic of gas payments using ERC20 tokens.

### Fetching ERC20 Fee Quotes

```typescript
// Requesting fee quotes for USDC token gas payments
const feeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(
  partialUserOp,
  {
    mode: PaymasterMode.ERC20,
    tokenList: ["0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31"],
  },
);

// Extracting the fee quotes and the paymaster address responsible for processing ERC20 token payments
const feeQuotes = feeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
const spender = feeQuotesResponse.tokenPaymasterAddress || "";
const usdcFeeQuotes = feeQuotes[0];
```

This crucial step involves obtaining the necessary fee quotes for using USDC to pay for gas.

### Updating UserOp for ERC20 Payments

```typescript
// Updating UserOp with ERC20 fee quotes and paymaster address
partialUserOp = await smartAccount.buildTokenPaymasterUserOp(partialUserOp, {
  feeQuote: usdcFeeQuotes,
  spender,
  maxApproval: false,
});
```

Here, the UserOp is modified to include details for ERC20 token payment, using USDC fee quotes.

### Finalizing UserOp with Correct Gas Limits and Paymaster Service Data

After setting up the UserOp for ERC20 token payments, the next step involves finalizing it with appropriate gas limits:

```typescript
// Configuring paymaster service data for ERC20 payments
let paymasterServiceData = {
  mode: PaymasterMode.ERC20,
  feeTokenAddress: usdcFeeQuotes.tokenAddress,
  calculateGasLimits: true,
};

try {
  // Requesting additional data from the paymaster, including gas limits
  const paymasterAndDataWithLimits =
    await biconomyPaymaster.getPaymasterAndData(
      partialUserOp,
      paymasterServiceData,
    );

  // Updating the partial UserOp with the returned paymaster and data
  partialUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;

  // If the calculateGasLimits flag is set to true, update the gas limits in the UserOp
  if (
    paymasterAndDataWithLimits.callGasLimit &&
    paymasterAndDataWithLimits.verificationGasLimit &&
    paymasterAndDataWithLimits.preVerificationGas
  ) {
    // Updating the UserOp with the gas limits that the paymaster service has agreed to
    partialUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
    partialUserOp.verificationGasLimit =
      paymasterAndDataWithLimits.verificationGasLimit;
    partialUserOp.preVerificationGas =
      paymasterAndDataWithLimits.preVerificationGas;
  }
} catch (e) {
  console.log("Error encountered: ", e);
}
```

After updating the `mintNFT` function to facilitate gas payments using ERC20 tokens (USDC), the final function should look like this:

<details>
  <summary>Click here to view the updated mintNFT function</summary>

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

  // Constructing a UserOp with the transaction details
  let partialUserOp = await smartAccount.buildUserOp([transaction]);

  // Setting up the paymaster for ERC20 token payments
  const biconomyPaymaster =
    smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

  // Requesting fee quotes for USDC token gas payments
  const feeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(
    partialUserOp,
    {
      mode: PaymasterMode.ERC20,
      tokenList: ["0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31"],
    },
  );

  // Extracting the fee quotes and the paymaster address responsible for processing ERC20 token payments
  const feeQuotes = feeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
  const spender = feeQuotesResponse.tokenPaymasterAddress || "";
  const usdcFeeQuotes = feeQuotes[0];

  // Updating UserOp with ERC20 fee quotes and paymaster address
  partialUserOp = await smartAccount.buildTokenPaymasterUserOp(partialUserOp, {
    feeQuote: usdcFeeQuotes,
    spender,
    maxApproval: false,
  });

  // Configuring paymaster service data for ERC20 payments
  let paymasterServiceData = {
    mode: PaymasterMode.ERC20,
    feeTokenAddress: usdcFeeQuotes.tokenAddress,
    calculateGasLimits: true,
  };

  try {
    // Requesting additional data from the paymaster, including gas limits
    const paymasterAndDataWithLimits =
      await biconomyPaymaster.getPaymasterAndData(
        partialUserOp,
        paymasterServiceData,
      );

    // Updating the partial UserOp with the returned paymaster and data
    partialUserOp.paymasterAndData =
      paymasterAndDataWithLimits.paymasterAndData;

    // If the calculateGasLimits flag is set to true, update the gas limits in the UserOp
    if (
      paymasterAndDataWithLimits.callGasLimit &&
      paymasterAndDataWithLimits.verificationGasLimit &&
      paymasterAndDataWithLimits.preVerificationGas
    ) {
      // Updating the UserOp with the gas limits that the paymaster service has agreed to
      partialUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
      partialUserOp.verificationGasLimit =
        paymasterAndDataWithLimits.verificationGasLimit;
      partialUserOp.preVerificationGas =
        paymasterAndDataWithLimits.preVerificationGas;
    }
  } catch (e) {
    console.log("Error encountered: ", e);
  }

  // Try to execute the UserOp and handle any errors
  try {
    // Send the UserOp through the smart account
    const userOpResponse = await smartAccount.sendUserOp(partialUserOp);

    // Wait for the transaction to complete and retrieve details
    const transactionDetails = await userOpResponse.wait();

    // Log the transaction details URL and the URL to view minted NFTs
    console.log(
      `Transaction Details: https://www.oklink.com/amoy/tx/${transactionDetails.receipt.transactionHash}`,
    );

    console.log(`View Minted NFTs: https://testnets.opensea.io/${address}`);
  } catch (e) {
    // Log any errors encountered during the transaction
    console.log("Error encountered: ", e);
  }
}
```

</details>

This final step integrates the paymaster service data into the UserOp, ensuring the transaction uses USDC for gas payments.

:::tip
By following these steps, you can seamlessly transition from native token gas payments to ERC20 tokens, offering users more flexibility in managing their blockchain transactions.
:::

Congratulations you can now execute ERC20 gas payment transactions utilizing the Biconomy SDK! Now let's take things Multi chain!

<details>
  <summary>📝 Click to view the complete code</summary>

```typescript
// Import necessary modules and configurations
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import { IBundler, Bundler } from "@biconomy/bundler"; // Biconomy bundler for managing gasless transactions
import {
  DEFAULT_ENTRYPOINT_ADDRESS,
  BiconomySmartAccountV2,
} from "@biconomy/account"; // Default entry point and smart account module from Biconomy
import { Wallet, ethers, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain
import { ChainId } from "@biconomy/core-types"; // Chain IDs for different blockchains supported by Biconomy
import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterFeeQuote,
} from "@biconomy/paymaster"; // Paymaster interface and Biconomy implementation
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules"; // Modules for ownership validation

config(); // Load environment variables from .env file
// Set up the Ethereum provider and wallet
const provider = new providers.JsonRpcProvider(
  "https://rpc-amoy.polygon.technology/", // JSON-RPC provider URL for the Polygon Amoy test network
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
    await smartAccount.getAccountAddress(), // Logging the address of the created smart account
  );
  return smartAccount;
}

// Function to mint an NFT gaslessly
async function mintNFT() {
  const smartAccount = await createSmartAccount();
  const address = await smartAccount.getAccountAddress();
  const nftInterface = new ethers.utils.Interface([
    "function safeMint(address _to)",
  ]);

  const data = nftInterface.encodeFunctionData("safeMint", [address]);
  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";

  const transaction = {
    to: nftAddress,
    data: data,
  };

  // Building a UserOp with the transaction details
  let partialUserOp = await smartAccount.buildUserOp([transaction]);

  // Initializing the paymaster for ERC20 token payments
  const biconomyPaymaster =
    smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

  // Requesting fee quotes for paying gas fees in ERC20 tokens (USDC)
  const feeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(
    partialUserOp,
    {
      mode: PaymasterMode.ERC20,
      tokenList: ["0xf555F8d9Cf90f9d95D34488e6C852796D9acBd31"],
    },
  );

  // Extracting the fee quotes and the paymaster address for ERC20 token payments
  const feeQuotes = feeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
  const spender = feeQuotesResponse.tokenPaymasterAddress || "";
  const usdcFeeQuotes = feeQuotes[0];

  // Rebuilding the UserOp for ERC20 token payment
  partialUserOp = await smartAccount.buildTokenPaymasterUserOp(partialUserOp, {
    feeQuote: usdcFeeQuotes,
    spender,
    maxApproval: false,
  });

  // Setting up paymaster service data for ERC20 payments
  let paymasterServiceData = {
    mode: PaymasterMode.ERC20,
    feeTokenAddress: usdcFeeQuotes.tokenAddress,
    calculateGasLimits: true,
  };

  try {
    // Requesting additional data from the paymaster, including gas limits
    const paymasterAndDataWithLimits =
      await biconomyPaymaster.getPaymasterAndData(
        partialUserOp,
        paymasterServiceData,
      );

    // Updating the partial UserOp with the returned paymaster and data
    partialUserOp.paymasterAndData =
      paymasterAndDataWithLimits.paymasterAndData;

    // If the calculateGasLimits flag is set to true, update the gas limits in the UserOp
    if (
      paymasterAndDataWithLimits.callGasLimit &&
      paymasterAndDataWithLimits.verificationGasLimit &&
      paymasterAndDataWithLimits.preVerificationGas
    ) {
      // Updating the UserOp with the gas limits that the paymaster service has agreed to
      partialUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
      partialUserOp.verificationGasLimit =
        paymasterAndDataWithLimits.verificationGasLimit;
      partialUserOp.preVerificationGas =
        paymasterAndDataWithLimits.preVerificationGas;
    }
  } catch (e) {
    console.log("Error encountered: ", e);
  }

  // Execute the UserOp
  try {
    const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
    const transactionDetails = await userOpResponse.wait();
    console.log(
      `Transaction details: https://www.oklink.com/amoy/tx/${transactionDetails.receipt.transactionHash}`,
    );
    console.log(`View minted NFTs: https://testnets.opensea.io/${address}`);
  } catch (e) {
    console.log("Error encountered: ", e);
  }
}

mintNFT();
```

</details>
