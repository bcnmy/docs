---
sidebar_label: "Cross-chain Swaps"
sidebar_position: 7
---

# Cross-chain Swap API-s

## **Seamless Crypto-to-Crypto Swap Integration**

We've established partnerships with leading crypto-to-crypto swap service providers and aggregators to facilitate a seamless integration of swap functionalities within our platform. Through their developer integration toolkits, users can now exchange cryptocurrencies directly within any app, website, or web plugin. This collaboration enables users to swap between various crypto assets without the need for multiple transactions or dealing with the intricacies of swapping different assets on separate platforms. It simplifies the process and ensures a convenient experience for managing their crypto portfolios. Please note that compliance with relevant regulatory requirements may apply to working with some of these providers.

## Our preferred Swap aggregator

## Our preferred Cross-chain Swap aggregator

Crypto swap aggregators enable access to multiple swap providers. The one listed below can be integrated through a unified interface, providing access to a broader audience right from the start.

| Partner | KYC requirement for users                                | Outlier factor                                                                                                                                       | Link to docs                | Supported pairs                                                                | KYB requirement to integrate |
| ------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| Li Fi   | no KYC, self-custodial cross chain or single chain swaps | Supports all major networks and most popular assets <br></br> <br></br>Finds the lowest prices across multiple DEX providers & bridges on the market | [Docs](https://docs.li.fi/) | [Link](https://docs.li.fi/list-chains-bridges-dexs-solvers) to Supported Pairs | No!                          |


## Our preferred Swap partners

| Partner                | KYC requirements for users   | Outlier factor                                                                                                  | Link to docs                                                                                                             | Supported pairs                                                    | KYB requirement to integrate                                                  |
| ---------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **XO Swaps by Exodus** | no KYC, self-custodial swaps | 1000+ tokens, millions of trading pairs across 50+ networks <br></br><br></br> Fast & frictionless atomic swaps | Available after KYB <br></br><br></br> Read more and get in touch with the team [here](https://www.exodus.com/xo-swap/). | Link to [supported pairs](https://www.exodus.com/status/)          | Yes, get in touch with the team [here](https://www.exodus.com/xo-swap/).      |
| **Moonpay Swaps**      | KYC-d swaps                  | 1500+ trading pairs across major blockchains <br></br><br></br> Regulated, compliant, secure (ISO 27001)        | [Read docs](https://dev.moonpay.com/v1.0/docs/ramps-swap)                                                                     | Link to [supported pairs](https://dev.moonpay.com/docs/swap-pairs) | Yes, get started [here](https://dashboard.moonpay.com/signup?invite=16548771) |

## Example User flow via Moonpay

### 1. **Enterswap details**

Enter the amount of your starting cryptocurrency and select a trading pair from a wide variety of combinations. Then, enter the destination address, which can be a different wallet application than the one for the base swap token. Addresses can be pre-filled by the app to simplify UX.

### 2. **Confirm the swap**

Review the details of the exchange, including swap amount, destination crypto wallet address, exchange rate, as well as any transaction fees incurred. Click the Swap button and you’ll be redirected to your wallet interface.

> ⚠️ If this is the user’s first time using Moonpay they will be required to go through a simple KYC process to comply with regulations.

### 3. **Sign the transaction in your wallet**

In your wallet application, sign the transaction to send crypto to the MoonPay wallet address to complete the exchange. Make sure that you have enough crypto in your wallet to cover any network fees.

> 💡 Using **Session Keys** within your app will eliminate the need for this step, and using our **Paymaster** will eliminate the need for the user to keep the blockchain’s native token to complete the swap.

### 4. **Check your crypto wallet**

After signing the transaction, your swap will begin processing. This typically takes between a few minutes and a few hours. You will receive an email once the swap is complete, after which you can check your cryptocurrency wallet to view your newly acquired coins, as well as your portfolio balance.
