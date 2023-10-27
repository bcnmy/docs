---
sidebar_label: 'Create Accounts'
sidebar_position: 1
---
# Create

The create method on the BiconomySmartAccountV2 class takes a configuration object when creating a new smart account. See chart and example code below for implementation details. 

## BiconomySmartAccountV2Config

| Parameter                | Description                                | Required |
|--------------------------|--------------------------------------------|----------|
| chainId              | Chain Id of preferred network                  | Yes      |
| paymaster            | Instance of Paymaster Class             | No       |
| bundler              | Instance of Bundler Class         | No       |
| entryPointAddress    | Entry point address to be used                 | Yes      |
| defaultValidationModule  | Default validation module instance            | Yes      |
| activeValidationModule   | Active validation module instance             | No       |
| rpcUrl                   | Optionally provide your own rpc url        | No       |
| index                | Index number                                 | No       |


```javascript

const smartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.POLYGON_MUMBAI, //or any chain of your choice
    bundler: bundler, // instance of bundler
    paymaster: paymaster, // instance of paymaster
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, //entry point address for chain
    defaultValidationModule: ownerShipModule, // either ECDSA or Multi chain to start
    activeValidationModule: ownerShipModule // either ECDSA or Multi chain to start
  })

```


In the coming sections we will refer to all methods by using `smartAcount.method`




