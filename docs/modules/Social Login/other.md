---
sidebar_position: 3
---

# Using other Auth Providers

Our documentation goes over using two modules for Social Login, this includes Particle Auth and Web3Auth. You are however able to use signer accounts from any other auth providers and SDK's. Let's take a look at the initilization object of our smart accounts again: 

```javascript
const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
    signer: 'Pass a signer from a Javascript Ethereum Provider',
    chainId: '',
}
```

As long as you are able to pass the configuration object a signer from a Javascript Ethereum Provider, you will be able to use other SDK's and auth providers with our smart accounts as well. For ease of use we recommend checkking our already integrated partners!