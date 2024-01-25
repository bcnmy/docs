---
sidebar_label: "Fiat Rails"
sidebar_position: 2
---

# Fiat Rails

## Seamless Fiat On-Ramp & Off-Ramp Integration

We've partnered with leading fiat On-Ramp & Off-Ramp service providers and aggregators, to offer a seamless integration of fiat-to-crypto and crypto-to-fiat transactions. With their developer integration toolkits, users can now buy or sell crypto directly within any app, website, or web plugin. By leveraging these providers, users can avoid the hassle of multiple separate transactions and the complexity of on/off-ramping for different assets. It streamlines the process and provides a convenient experience for handling their crypto holdings. Please note that KYB (Know Your Business) requirements may apply separately when working with the on-ramp provider to ensure compliance with regulations.

## Our preferred onramp aggregators

Onramp aggregators enable access to multiple onramp providers. The one listed below can also be integrated through a single interface. This helps in gaining access to a larger audience from day one.

| Fiat Onramp | Outlier Factor                                                                                    | Quick Guides                                                                                                                                                               | Supported Currencies                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Meld**        | 15+ onramps and offramps support, easy integration, serves global audience.                       | [Technical Docs](https://docs.meld.io/password?redirect=/docs/getting-started) (pwd: 'build-easy')                                                                         | [List](https://docs.meld.io/docs/crypto-supported-service-providers-assets)            |
| **Poko**        | Best for games, Onramp Aggregator, Strong and wide support for Alternative Payment Methods (APMs) | [Demo Video](https://www.loom.com/share/f3eac5212cb443ed8f9f5e849ccd9287), [Technical Docs](https://pokoapp.gitbook.io/documentation/other-resources/how-to-get-onboarded) | [List](https://docs.pokoapp.xyz/onramp-aggregator/country-and-payment-method-coverage) |

## Our preferred onramp partners

| Fiat Onramp  | Outlier Factor                                                                                                                           | Quick Guides                                                                                                                                                                                                    | Supported Currencies                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Ramp Network** | global coverage on/off-ramp, most payment methods & currencies, best Ux with Native integration, lowest user fees, high conversion rates | [Technical Docs](https://docs.ramp.network/), [Off-ramp Demo Video](https://www.youtube.com/watch?v=KSXgmRpl_Pg)                                                                                                | [List](https://support.ramp.network/en/articles/471-supported-fiat-currencies)                           |
| [**Transak**](/Account/fiatonramp)      | Best rates globally, native integration for all products with Biconomy SDK                                                               | [Demo UI](https://transak-biconomy.netlify.app/), [Demo Video](https://www.loom.com/share/90d1473db6cd44879a24c3407bf39789), [Technical Docs](https://docs.biconomy.io/guides/enable-fiat-on-ramp-and-off-ramp) | [List](https://docs.transak.com/docs/fiat-currency-country-payment-method-coverage-plus-fees-and-limits) |
| **Unlimit**      | Simple and flexible integration methods, easy and secure verification methods.                                                           | [Technical Docs](https://docs.gatefi.com/docs/gatefi-docs/zczlqjv647sxz-what-is-unlimit-crypto)                                                                                                                 | [List](https://docs.gatefi.com/docs/gatefi-docs/dqboe8phjgui5-supported-assets-and-payments)             |

## User Flow

### On-Ramp Flow

The user is redirected to the buy crypto page, where they go through the following steps:

1. The user places an order in their preferred fiat for their chosen crypto and selects a payment method.
2. If this is the user's first time buying through the service provider, the user goes through the provider's KYC process.
3. The service provider takes a fiat payment from the user.
4. The service provider converts the fiat to crypto and sends it to the user's smart contract wallet.
5. The user now has the crypto they need to use your dApp.

### Off-Ramp Flow

After integrating with the Off-Ramp service, a user must follow several steps to liquidate their crypto holdings:

1. First-time users need to go through a simple one-time KYC process.
2. After this, users can complete the crypto payment from their smart contract wallet whenever they want to liquidate their crypto holdings.
3. Behind the scenes, the service provider reconciles the crypto payment made by the user and transfers the equivalent fiat in the chosen currency to the user's bank account, all within a few minutes.

&nbsp;

**If your bank does not support Instant bank transfers, it may take 24-48 hours. For some cryptocurrencies, the minimum buy amount may be greater due to the minimum withdrawal limit of partner exchanges.**
