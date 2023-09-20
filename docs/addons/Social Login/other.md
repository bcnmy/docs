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

As long as you can provide a signer from a JavaScript Ethereum Provider in the configuration object, you can utilize various other SDKs and authentication providers seamlessly with our smart accounts. We recommend exploring our pre-integrated partners for a smoother and more user-friendly experience.