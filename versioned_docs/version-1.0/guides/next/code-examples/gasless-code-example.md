---
sidebar_position: 1
---

# Gasless Code Example

## Send Single Gasless Transaction With Social Login

```js
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";

const socialLoginSDK = new SocialLogin();
const signature = await socialLoginSDK.whitelistUrl('https://yourdomain.com');
await socialLoginSDK.init({
  whitelistUrls: {
    'https://yourdomain.com': signature,
  }
});

socialLoginSDK.showWallet();

if (!socialLoginSDK?.provider) return;
const provider = new ethers.providers.Web3Provider(
    socialLoginSDK.provider,
);
const walletProvider = new ethers.providers.Web3Provider(provider);
const accounts = await provider.listAccounts();

// Initialize the Smart Account
// All values are optional except networkConfig only in the case of gasless dappAPIKey is required
let options = {
  activeNetworkId: ChainId.GOERLI,
  supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI],
  networkConfig: [
    {
      chainId: ChainId.POLYGON_MUMBAI,
      // Dapp API Key you will get from new Biconomy dashboard that will be live soon
      // Meanwhile you can use the test dapp api key mentioned above
      dappAPIKey: <DAPP_API_KEY>,
      providerUrl: <YOUR_PROVIDER_URL>
    },
    {
      chainId: ChainId.POLYGON_MAINNET,
      // Dapp API Key you will get from new Biconomy dashboard that will be live soon
      // Meanwhile you can use the test dapp api key mentioned above
      dappAPIKey: <DAPP_API_KEY>,
      providerUrl: <YOUR_PROVIDER_URL>
    }
  ]
}

let smartAccount = new SmartAccount(walletProvider, options);
smartAccount = await smartAccount.init();

const erc20Interface = new ethers.utils.Interface([
  'function transfer(address _to, uint256 _value)'
])
// Encode an ERC-20 token transfer to recipient of the specified amount
const data = erc20Interface.encodeFunctionData(
  'transfer', [recipientAddress, amount]
)
const tx = {
  to: usdcAddress,
  data
}

// Transaction subscription. One can subscribe to various transaction states
// Event listener that gets triggered once a hash is generetaed
smartAccount.on('txHashGenerated', (response: any) => {
  console.log('txHashGenerated event received via emitter', response);
});
smartAccount.on('onHashChanged', (response: any) => {
  console.log('onHashChanged event received via emitter', response);
});
// Event listener that gets triggered once a transaction is mined
smartAccount.on('txMined', (response: any) => {
  console.log('txMined event received via emitter', response);
});
// Event listener that gets triggered on any error
smartAccount.on('error', (response: any) => {
  console.log('error event received via emitter', response);
});

// Sending gasless transaction
const txResponse = await smartAccount.sendTransaction({ transaction: tx1 });
console.log('userOp hash', txResponse.hash);
// If you do not subscribe to listener, one can also get the receipt like shown below
const txReciept = await txResponse.wait();
console.log('Tx hash', txReciept.transactionHash);

// DONE! You just sent a forward transaction
```

## Send Batched Gasless Transactions With Social Login

```js
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";

const socialLoginSDK = new SocialLogin();
const signature = await socialLoginSDK.whitelistUrl('https://yourdomain.com');
await socialLoginSDK.init({
  whitelistUrls: {
    'https://yourdomain.com': signature,
  }
});

socialLoginSDK.showWallet();

if (!socialLoginSDK?.provider) return;
const provider = new ethers.providers.Web3Provider(
    socialLoginSDK.provider,
);
const walletProvider = new ethers.providers.Web3Provider(provider);
const accounts = await provider.listAccounts();

// Initialize the Smart Account
// All values are optional except networkConfig only in the case of gasless dappAPIKey is required
let options = {
  activeNetworkId: ChainId.GOERLI,
  supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI],
  networkConfig: [
    {
      chainId: ChainId.POLYGON_MUMBAI,
      // Dapp API Key you will get from new Biconomy dashboard that will be live soon
      // Meanwhile you can use the test dapp api key mentioned above
      dappAPIKey: <DAPP_API_KEY>,
      providerUrl: <YOUR_PROVIDER_URL>
    },
    {
      chainId: ChainId.POLYGON_MAINNET,
      // Dapp API Key you will get from new Biconomy dashboard that will be live soon
      // Meanwhile you can use the test dapp api key mentioned above
      dappAPIKey: <DAPP_API_KEY>,
      providerUrl: <YOUR_PROVIDER_URL>
    }
  ]
}


let smartAccount = new SmartAccount(walletProvider, options);
smartAccount = await smartAccount.init();

// One needs to prepare the transaction data
// Here we will be transferring ERC 20 tokens from the Smart Contract Wallet to an address
const erc20Interface = new ethers.utils.Interface(ERC_20_ABI)

// Encode an ERC-20 token approval to spenderAddress of the specified amount
const approvalEncodedData = erc20Interface.encodeFunctionData(
  'approve', [spenderAddress, amount]
)
// Encode an ERC-20 token transferFrom from an address of the specified amount
const transferFromEncodedData = erc20Interface.encodeFunctionData(
  'transferFrom', [from, receipientAddress, amount]
)
const txs = [];
// You need to create transaction objects of the following interface
const tx1 = {
  to: usdcAddress, // destination smart contract address
  data: approvalEncodedData
}
txs.push(tx1);
const tx2 = {
  to: usdcAddress,
  data: transferFromEncodedData
};
txs.push(tx2);

// Transaction subscription. One can subscribe to various transaction states
// Event listener that gets triggered once a hash is generetaed
smartAccount.on('txHashGenerated', (response: any) => {
  console.log('txHashGenerated event received via emitter', response);
});
smartAccount.on('onHashChanged', (response: any) => {
  console.log('onHashChanged event received via emitter', response);
});
// Event listener that gets triggered once a transaction is mined
smartAccount.on('txMined', (response: any) => {
  console.log('txMined event received via emitter', response);
});
// Event listener that gets triggered on any error
smartAccount.on('error', (response: any) => {
  console.log('error event received via emitter', response);
});

// Sending gasless transaction
const txResponse = await smartAccount.sendTransactionBatch({ transactions: txs });
console.log('UserOp hash', txResponse.hash);
// If you do not subscribe to listener, one can also get the receipt like shown below
const txReciept = await txResponse.wait();
console.log('Tx Hash', txReciept.transactionHash);
// DONE! You just sent a batched gasless transaction
```

:::caution
For common errors check [this](https://docs.biconomy.io/references/common-errors).
:::

## Code Examples

- https://github.com/bcnmy/sdk-examples/tree/master/react-biconomy-web3Auth
- https://github.com/bcnmy/sdk-demo
- https://github.com/bcnmy/hyphen-ui/tree/demo-sdk

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
