---
sidebar_label: 'WAGMI'
sidebar_position: 3
---

# Create Smart Accounts with WAGMI React Hooks

This section shows how to use Wagmi React Hooks to create a Smart Account with Biconomy. If you would like to simply see a code implementation, one is available [here](https://github.com/bcnmy/biconomy_wagmi_example) which showcases how to create a smart account using Wagmi.

## Dependencies

You will need the following dependencies to create a Smart Account this way:

```bash
yarn add wagmi viem @alchemy/aa-core @biconomy/account @biconomy/bundler @biconomy/common @biconomy/core-types @biconomy/modules @biconomy/paymaster
```

## Set up Wagmi Config

First we'll need to set up the Wagmi config file to wrap the full app. The context below assumes a Next JS application but can be used in any React framework.

### Imports 

```typescript

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { baseGoerli } from '@wagmi/core/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { createPublicClient, http } from 'viem'

```

### Config Setup

```typescript

const { chains, webSocketPublicClient } = configureChains(
  [baseGoerli],
  [alchemyProvider({ apiKey: '' }), publicProvider()],
)

const config = createConfig({
  autoConnect: false,
  publicClient: createPublicClient({
    chain: baseGoerli,
    transport: http()
  }),
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
    </>
  )
}

```

With the config completed we can now access the Wagmi hooks in our other components. 

### Hooks Imports

```typescript
import { useConnect, useAccount, useDisconnect, useWalletClient } from 'wagmi'
import { WalletClientSigner } from "@alchemy/aa-core";
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ChainId } from "@biconomy/core-types"
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { IBundler, Bundler } from '@biconomy/bundler'
import { useState } from 'react';
```

## Create Bundler and Paymaster Instance

To set up the smart account lets instances of our bundler and Paymaster set up. These opitonal values in creating the smart account will be helpful in accessing the full stack of Account Abstraction made available by the Biconomy SDK. 

```typescript
 const bundler: IBundler = new Bundler({
    bundlerUrl: "",    
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: ""
  })
```

## Connect to Users EOA and Create Smart account

Once connected to the users EOA we can access the wallet client and use Alchemy's `WalletClientSigner` to create a signer to pass over to our SDK. 

```typescript

const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const [ smartAccountAddress, setSmartAccountAddress ] = useState()
  
  const bundler: IBundler = new Bundler({
    bundlerUrl: "",    
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })


  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: ""
  })

  const createSmartAccount = async () => {
    if(!walletClient) return
    const signer = new WalletClientSigner(walletClient,"json-rpc" )
    const ownerShipModule = await ECDSAOwnershipValidationModule.create({
      signer: signer,
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    })

    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.BASE_GOERLI_TESTNET,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: ownerShipModule,
      activeValidationModule: ownerShipModule
    })
    console.log({ biconomySmartAccount })
    const saAddress = await biconomySmartAccount.getAccountAddress();
    setSmartAccountAddress(saAddress)
  }

```

See a basic implementation in the UI below: 

```typescript
return (
    <>
      <Head>
        <title>Biconomy x WAGMI</title>
        <meta name="description" content="WAGMI Hooks With Biconomy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Biconomy x WAGMI Example</h1>
        { address && <h2>EOA: {address}</h2>}
        {smartAccountAddress && <h2>Smart Account: {smartAccountAddress}</h2>}
        {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}
 
      {error && <div>{error.message}</div>}
      {isConnected && <button onClick={disconnect}>Disconnect</button>}
      {isConnected && <button onClick={createSmartAccount}>Create Smart Account</button>}
      </main>
    </>
  )

```

You are now ready to get started using WAGMI with Biconomy. For a full code implementation check out [this example repo](https://github.com/bcnmy/biconomy_wagmi_example). 