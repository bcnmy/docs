---
sidebar_label: "FAQ"
sidebar_position: 13
---

## Smart accounts and SDK

**Will I get the same smart account address on all chains?**

Yes, you will get the same address on all chains as long as the owner's address is the same.
    
**How can I create another smart account using the same EOA on the same chain?**
    
you can pass the `index` in the config while creating the account as mentioned in the createSmartAccountClient [method](https://docs.biconomy.io/Account/methods#createsmartaccountclient). First smart account gets created with index 0 by default. 
    
**Where can I find more examples of SDK integrations?**
    
https://github.com/bcnmy/sdk-examples
    
**How can I increase the timeout in the waitForTransactionHash function?**
    
Initialize the bundler with updated configuration, to increase the timeout (milliseconds).

```jsx
import { createSmartAccountClient, createBundler } from "@biconomy/account";

const biconomySmartAccount = await createSmartAccountClient({
    signer,
    bundler: await createBundler({
    bundlerUrl: "bundler url",
    userOpReceiptMaxDurationIntervals: { 80002: 60000 },
    }),
});
```
    
**Which social login methods are supported?**
    
Explore services such as Web3Auth, Particle Network, Magic.link, or Lit Protocol to link a user's social identity with a cryptographic key. This key can then serve as the owner of the Smart Account. Be sure to check out various [signers](https://docs.biconomy.io/Account/signers/) integrations for this purpose.
    
**How do I enable session keys for users?**
    
Utilize the session key validation [module](https://docs.biconomy.io/Modules/sessionvalidationmodule).

**How to enable debug mode in SDK to log more?**

Set following env flag to true before running the app. `export BICONOMY_SDK_DEBUG=true`

## Bundler & Paymaster

**Is the bundler URL the same for all chains?**
    
Yes, for testnets same [bundler URL](/dashboard#bundler-url) can be used, just change the chainId. For mainnet you can reach out to [us](https://t.me/rhicsanchez).
    
**How can I sign the userOp manually?**
    
To sign the userOp manually, first calculate the userOpHash and then sign it using the same signer, the account is created with. you can find more details [here](https://hackmd.io/@xWzOEjWIRIKP22EKSdIgEg/Hk5SGcK-o).
    
**Can I just use Biconomy’s bundler with another smart account implementation?**
    
Yes, Biconomy's bundler seamlessly integrates with other smart account providers. As long as the user operation remains valid and complies with ERC 4337 specifications, the integration is possible.

**Which ERC20 tokens are supported by the biconomy paymaster? How can I add support for a custom ERC20 token?**
    
You can check out the list of supported networks [here](/supportedNetworks). You can reach out to us here for custom token requirements.
    
**Can I use other paymaster with Biconomy SDK?**
    
Yes, you can. It completely depends on how the `paymasterAndData` is parsed in the paymaster. The only restriction is that it should first encode the paymaster address after that encoding can be anything till the time decoding is consistent. Bundler does not care about the paymasterAndData.
    
**Can I fund the gasTank programmatically?**
    
You can programmatically deposit funds using the paymasterContract `depositFor` function by passing the `amount` and `paymasterId` which is the EOA address. For instance, you can invoke the following [function](https://polygonscan.com/address/0x00000f79b7faf42eebadba19acc07cd08af44789#writeContract#F3) on the Polygon chain. Check out [this](https://gist.github.com/arcticfloyd1984/819b24d3d19adf039c7eefe6ae98836c) script for the same.
    
**Are there APIs to create my own dashboard?**
    
Yes, you can utilize the [dashboard APIs](/dashboard/apis) to create a paymaster, change policies, and even get the transaction's data.