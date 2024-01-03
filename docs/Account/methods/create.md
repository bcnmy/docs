---
sidebar_label: "Create Accounts"
sidebar_position: 1
custom_edit_url: https://github.com/bcnmy/docs/blob/master/docs/Account/methods/create.md
---

# Create

The create method on the BiconomySmartAccountV2 class takes a configuration object when creating a new smart account. See chart and example code below for implementation details. The addresses of ERC-4337 smart accounts follow a deterministic pattern. This enables you to identify the address off-chain before the account is actually deployed.

## BiconomySmartAccountV2Config

| Parameter               | Description                         | Required |
| ----------------------- | ----------------------------------- | -------- |
| chainId                 | Chain Id of preferred network       | Yes      |
| biconomyPaymasterApiKey or paymaster | Paymaster api key or Instance of Paymaster Class | No       |
| bundlerUrl or bundler     | Bundler url or Instance of Bundler Class |Yes|
| entryPointAddress       | Entry point address to be used      | No      |
| defaultValidationModule or signer | Default validation module instance or Signer/WalletClientSigner  | Yes      |
| activeValidationModule  | Active validation module instance   | No       |
| rpcUrl                  | Optionally provide your own rpc url | No       |
| index                   | Index number                        | No       |

```javascript
const smartAccount = await BiconomySmartAccountV2.create({
  chainId: ChainId.POLYGON_MUMBAI, //or any chain of your choice
  bundlerUrl: bundlerUrl, // instance of bundler
  signer: signer
});
```

:::info
Building on Chiliz Mainnet or the Spicy Testnet? Note that the entry point address on this is different as it was deployed by us on the Biconomy team. The address of the entry point is : [0x00000061FEfce24A79343c27127435286BB7A4E1](https://scan.chiliz.com/address/0x00000061FEfce24A79343c27127435286BB7A4E1/contracts#address-tabs) and you will have to provide it through the entryPointAddress param.
:::

In the coming sections we will refer to all methods by using `smartAcount.method`
