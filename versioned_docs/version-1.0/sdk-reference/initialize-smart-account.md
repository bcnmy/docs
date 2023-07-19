---
sidebar_position: 2
---

# Initialize Smart Account Instance

> Connecting your EOA signer account for multi-chain Smart Account access

:::info
Biconomy Smart Account is a Smart Contract Wallet that sits on top of your EOA account. EOA is the controller for this smart account and authorizes transactions with signing.
:::

To create Smart Account, you need to pass EOA and provider.

In this example, we start using `Web3AuthContext` with the `useWeb3AuthContext()`method. And we take the address and provider from this context.

You can replace this with your wallet provider object and EOA address.

:::info
Web3AuthContext is a [React Context](https://www.freecodecamp.org/news/react-context-for-beginners/) to store Social Login values.
Please refer to the [demo React app repository](https://github.com/bcnmy/sdk-examples/tree/master/react-biconomy-web3Auth) which uses contexts for more details on this approach.
:::

```js
import {
  ChainId
} from "@biconomy/core-types";
import { useWeb3AuthContext } from "./contexts/SocialLoginContext";

import SmartAccount from "@biconomy/smart-account";

// Get the EOA and provider from the wallet of your choice.
const { provider, address } = useWeb3AuthContext();
const walletProvider = new ethers.providers.Web3Provider(provider);

// Initialize the Smart Account

let options = {
 activeNetworkId: ChainId.GOERLI,
 supportedNetworksIds: [ ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI
 ]}
  
let smartAccount = new SmartAccount(walletProvider, options);
smartAccount = await smartAccount.init();
```

The above code connects your EOA signer and spins up a multi-chain instance of the Smart Account

:::info
Options that can be provided for Smart Account initialization are below. If you don't provide any of the values it gets merged with the default Biconomy SDK config.
:::

```js
export interface SmartAccountConfig {
  activeNetworkId: ChainId // active (default) networkId 
  supportedNetworksIds: ChainId[] // array of supported networks your Dapp is on
  backendUrl: string 
  relayerUrl: string // if you're running your own relayer provide url here
  socketServerUrl: string // specific to biconomy messaging sdk
  signType: SignTypeMethod // by default is EIP712_SIGN
  networkConfig: NetworkConfig[] // array of chain specific network config
  entryPointAddress?: string // optional entry point address
  biconomySigningServiceUrl?: string 
  bundlerUrl?: string // bundlerUrl to fallback to if chain specific is not provided
  environment?: Environments // environment PROD/STAGING/DEV
}

// where NetworkConfig is...

export type NetworkConfig = {
  chainId: ChainId
  providerUrl?: string // custom RPC url of your choice
  bundlerUrl?: string // if you're running your own bundler provide url here
  customPaymasterAPI?: IPaymasterAPI // if you need to plug in custom paymaster
  dappAPIKey?: string // optional dapp api key. must be added while using Biconomy paymaster dashboard 
}
```

:::info
If you have any questions please post them on the [Biconomy SDK Forum](https://forum.biconomy.io/)
:::
