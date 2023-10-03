---
sidebar_position: 3
---
# Initialization

## Configuration
| Key                | Description |
| -------------------| ------------- |
| bundlerUrl         | Represent ERC4337 spec implemented bundler url. you can get one from biconomy dashboard. Alternatively you can supply any of your preferred|
| chainId            | This represents the network your smart wallet transactions will be conducted on. [Click here for supported Chains ](/docs/supportedchains/)|
| entryPointAddress  | Since entrypoint can have different addresses you can call getSupportedEntryPoints() on bundler instance for supported addresses list|

```typescript
// This is how you create bundler instance in your dapp's
import { IBundler, Bundler } from '@biconomy/bundler'

// Make use of core-types package
import { ChainId } from "@biconomy/core-types";

const bundler: IBundler = new Bundler({
    bundlerUrl: 'https://bundler.biconomy.io/api/v2/{CHAINID}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',      
    chainId: ChainId.POLYGON_MAINNET,
    entryPointAddress: '',
  })
```

If You would like to use the Bundler on Mainnet, please contact us!