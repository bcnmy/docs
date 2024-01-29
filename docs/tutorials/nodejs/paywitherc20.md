---
sidebar_label: "Pay for Gas with ERC20 Tokens"
sidebar_position: 4
---

# Paying for Gas with ERC20 Tokens 🛢️💳

This guide focuses on using ERC20 tokens like USDC to cover gas fees, adding flexibility in handling transaction costs.
For this tutorial you will need some **Test USDC tokens** (**0xda5289fcaaf71d52a80a254da614a192b693e977**).

:::info Preparation
Before starting, acquire test USDC tokens. Swap test Matic for USDC on [Uniswap](https://app.uniswap.org/#/swap) connected to the Polygon Mumbai network. Obtain test Matic from the [polygon faucet](https://faucet.polygon.technology/). Make sure to swap for Polygon Mumbai USDC test tokens at this address:
0xda5289fcaaf71d52a80a254da614a192b693e977
:::

User can pay in any ERC20 token of their choice. Please find the supported list of ERC20 tokens [here](https://docs.biconomy.io/supportedchains/supportedTokens).

## 🔄 Updated Imports for paying Gas with ERC20

Let's review the updated imports necessary for this functionality:

- `IHybridPaymaster`, `SponsorUserOperationDto`, `PaymasterFeeQuote` from` @biconomy/paymaster`: These are additional interfaces to support complex paymaster operations. They play crucial roles in enabling ERC20 token payments for gas fees.

```typescript
// Import necessary modules and configurations
import { config } from "dotenv"; // dotenv for loading environment variables
import {
  createSmartAccountClient,
  PaymasterMode,
  IHybridPaymaster,
  PaymasterFeeQuote,
  SponsorUserOperationDto,
} from "@biconomy/account";
import { Wallet, ethers, providers } from "ethers"; // Ethereum blockchain interactions

config();
```

### Original Sponsored Paymaster Setup

Initially, the paymaster was set up for sponsored transactions:

```typescript
let partialUserOp = await smartAccount.sendTransaction([transaction, transaction], {
  paymasterServiceData: {
    mode: PaymasterMode.SPONSORED,
  },
});
```

### New ERC20 Token Paymaster Setup

Replace the above code with the following to enable ERC20 token payments:

If the preferred ERC20 token is known, do the following

```typescript
  const { wait } = await smartAccount.sendTransaction([transaction], {
    paymasterServiceData: {
      mode: PaymasterMode.ERC20,
      preferredToken: "0xda5289fcaaf71d52a80a254da614a192b693e977", // USDC
    },
  });
```

If there is a list of tokens to choose from, we need to fetch the token fees options

```typescript
  // Requesting fee quotes for USDC token gas payments
  const feeQuotesResponse = await smartAccount.getTokenFees(transaction, {
    paymasterServiceData: {
      mode: PaymasterMode.ERC20,
      tokenList: ["0xda5289fcaaf71d52a80a254da614a192b693e977", "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832"], // USDC, USDT
    },
  });

  // Extracting the fee quotes and the paymaster address responsible for processing ERC20 token payments
  const feeQuotes = feeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
  const spender = feeQuotesResponse.tokenPaymasterAddress || "";
  const usdcFeeQuotes = feeQuotes[0];
```

This crucial step involves obtaining the necessary fee quotes for using ERC20 to pay for gas.

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

  // Try to execute the UserOp and handle any errors
  try {
    // Send the UserOp through the smart account
     const userOpResponse = await smartAccount.sendTransaction([transaction], {
      paymasterServiceData: {
        mode: PaymasterMode.ERC20,
        preferredToken: "0xda5289fcaaf71d52a80a254da614a192b693e977",
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

:::tip
By following these steps, you can seamlessly transition from native token gas payments to ERC20 tokens, offering users more flexibility in managing their blockchain transactions.
:::

Congratulations you can now execute ERC20 gas payment transactions utilizing the Biconomy SDK! Now let's take things Multi chain!

<details>
  <summary>📝 Click to view the complete code</summary>

```typescript
// Import necessary modules and configurations
import { config } from "dotenv"; // dotenv for loading environment variables from a .env file
import {
  createSmartAccountClient,
  PaymasterMode,
  IHybridPaymaster,
  PaymasterFeeQuote,
  SponsorUserOperationDto,
} from "@biconomy/account";
import { Wallet, ethers, providers } from "ethers"; // ethers for interacting with the Ethereum blockchain

config(); // Load environment variables from .env file
// Set up the Ethereum provider and wallet
const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai", // JSON-RPC provider URL for the Polygon Mumbai test network
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider); // Creating a wallet instance with a private key from environment variables

const bundlerUrl = "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";

// Function to create a Biconomy Smart Account
async function createSmartAccount() {
  let smartAccount = await createSmartAccountClient({
    signer: wallet,
    bundlerUrl, // The configured bundler instance
  });
  console.log("Smart Account Address: ", await smartAccount.getAccountAddress());
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
     const userOpResponse = await smartAccount.sendTransaction([transaction], {
      paymasterServiceData: {
        mode: PaymasterMode.ERC20,
        preferredToken: "0xda5289fcaaf71d52a80a254da614a192b693e977",
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

mintNFT();
```

</details>
