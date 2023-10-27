---
sidebar_label: 'Get Methods'
sidebar_position: 2
---
# Get Methods

The following are methods for getting information about your Smart Account. 

:::info
These methods are available after creating an instance of your smart accounts. See [create method](/Account/methods/create) for more information. Make sure to call any of these from an async function!
:::

## getAccountAddress()

This method returns a promise that resolves to a string representing the address of your smart account

```js

const address = await smartAccount.getAccountAddress();

```

## getAllSupportedChains()

This method returns a promise that resolves into a list of all supported chains for the smart account

```js

const supportedChains = await smartAccount.getAllSupportedChains()

```

## getAllTokenBalances()

This method returns a promise that resolves to the total token balances from your Smart Account it takes a balance params object as listed below.

```js

  const balanceParams =
      {
        chainId: ChainId.POLYGON_MAINNET, // chainId of your choice
        eoaAddress: address, // although it is defined as eoaAddress you need to pass your smart account address
        tokenAddresses: [], // optionally provide token addresses you want to show
      };

  const balFromSdk = await smartAccount.getAllTokenBalances(balanceParams);
```

## getTotalBalanceInUsd()

This method returns a promise that resolves to a list of token balances in USD for your smart account. 

```js

const balanceParams =
      {
        chainId: ChainId.POLYGON_MAINNET, // chainId of your choice
        eoaAddress: address, // although it is defined as eoaAddress you need to pass your smart account address
        tokenAddresses: [], // optionally provide token addresses you want to show
      };

const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams);

```

## getSmartAccountsByOwner()

This method returns a smart account at a given index from a specific EOA

```js

const params = {
  chainId: 80001, //or any chain id of your choice
  owner: "eoa address",
  index: 0
}

const account = getSmartAccountsByOwner({params})

```

## getNonce()

This method returns a promise which resolves to a nonce as a big number

```js

const nonce = await smartAccount.getNonce()
console.log(nonce.toNumber())

```

## index

This returns index of the current active smart account

```js

const index = smartAccount.index

```

## activeValidationModule

This returns an object with information about the current active validation module 

```js

const activeValidationModule = smartAccount.activeValidationModule

```

Sample object: 

```js

ECDSAOwnershipValidationModule {
  entryPointAddress: '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789',
  version: 'V1_0_0',
  moduleAddress: '0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e',
  signer: Wallet {
    _isSigner: true,
    _signingKey: [Function (anonymous)],
    _mnemonic: [Function (anonymous)],
    address: '0x322Af0da66D00be980C7aa006377FCaaEee3BDFD', // this is your signers address
    provider: JsonRpcProvider {
      _isProvider: true,
      _events: [],
      _emitted: [Object],
      disableCcipRead: false,
      formatter: [Formatter],
      anyNetwork: false,
      _networkPromise: [Promise],
      _maxInternalBlockNumber: -1024,
      _lastBlockNumber: -2,
      _maxFilterBlockRange: 10,
      _pollingInterval: 4000,
      _fastQueryDate: 0,
      connection: [Object],
      _nextId: 42
    }
  }

```