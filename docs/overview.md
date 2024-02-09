---
sidebar_position: 1
slug: /
---

# Overview

The Biconomy SDK is an Account Abstraction toolkit that enables a simple UX for your dApp, wallet, or appchain.

Built on top of [ERC 4337](https://eips.ethereum.org/EIPS/eip-4337), we offer a full-stack solution for tapping into the power of our Smart Accounts Platform, Paymasters, and Bundlers.

<!-- ![FullStakAA](./images/overview/fullstackaa.png) -->

<div style={{ paddingBottom: '30px' }}>
  <div style={{ display: "flex", flexWrap: "wrap", marginBottom: '10px' }}>
    <a href="/account" className="overview-section-link">
      <div className="overview-section" style={{ width: "360px", marginRight: '10px', border: '2px solid #ddd', borderRadius: '8px', padding: '10px'}}>
        <h2 style={{marginBottom: "5px"}}>Smart Accounts</h2>
        <p
          style={{ color: '#717179', fontSize: '14px'}}
        >Easily implement account abstraction in your app.</p>
      </div>
    </a>
    <div className="overview-section" style={{ width: "360px", border: '2px solid #ddd', borderRadius: '8px', padding: '10px'}}>
      <a href="/paymaster" className="overview-section-link">
        <h2 style={{marginBottom: "5px"}}>Paymaster</h2>
      </a>
      <p style={{ color: '#717179', fontSize: '14px'}}>Enable sponsored or gasless transactions.</p>
    </div>
  </div>
  <div style={{ display: "flex" }}>
    <div className="overview-section" style={{  width: "360px", border: '2px solid #ddd', borderRadius: '8px', padding: '10px'}}>
      <a href="/bundler" className="overview-section-link">
      <h2 style={{marginBottom: "5px"}}>Bundler</h2>
      </a>
      <p style={{ color: '#717179', fontSize: '14px'}}>Bundle and submit transactions.</p>
    </div>
  </div>
</div>

Biconomy also offers the ability to build custom [Modular smart accounts](/modules). Users can install validation modules that authorize actions or execution modules that define custom logic, avoiding full account redeployment to add features.

![FullStakAA](./images/overview/fullstackaa.png)

## Smart Accounts Platform

The [Biconomy Smart Account](/account) is an ERC 4337-compliant solution that works with any Paymaster and Bundler service.

Smart Accounts are governed by code instead of ECDSA, which allows for other types of signature algorithms to be used with the Smart Account. Additionally, the smart accounts package allows you to quickly and easily build and execute User Operations or userOps. These are pseudo-transaction objects that eventually execute as a transaction on the EVM.

Biconomy Smart Accounts are signer agnostic, which allows you to use any authorization package of your choice as long as you can pass a signer to our SDK upon the creation of a Smart Account. Check out different ways you can create a Biconomy Smart Account [here](/account/signers).

Smart Accounts are further enhanced by validation modules that allow you to execute arbitrary logic before validating a userOp. This allows you, as a developer, to build modules that allow for session keys, multi-chain validation modules, passkeys, and more.

![ModularSA](./images/overview/modularsa.png)

If you want to start diving into Smart Accounts you can do so [here](/account). If you already understand Smart Accounts and prefer to start working with modules, start learning about them [here](/modules) or follow this step-by-step [tutorial](/tutorials/sessionkeys) on how to build a dApp that utilizes session key modules.

## Paymaster

Biconomy offers a [Paymaster service](paymaster) designed with one of the best developer experiences in mind. Simply use one URL and switch modes between our sponsorship paymaster and our Token Paymaster.

### Sponsorship Paymaster

![Sponsored](./images/overview/sponsored.png)

If the mode you choose in the request to the Paymaster URL is the sponsored mode, your users will benefit from gasless transactions, and you remove the friction point of needed native tokens to pay for gas on transactions. Learn how to set up your paymaster [here](/dashboard/paymaster).

### Token Paymaster

![Erc20](./images/overview/erc20gas.png)

Switching the mode of your Paymster to ERC20 allows you to unlock an experience where users can pay gas in any of our supported ERC20 tokens on different networks. Check out the latest supported tokens [here](/paymaster/supportedNetworks).

Learn how to utilize either of these Paymasters by checking out our How To Guide on [Executing transactions](/tutorials)

## Bundler

The [Bundler](/bundler) is a service that tracks userOps that exist in an alternative mem pool and as the name suggests, bundles them together to send to an Entry Point Contract for eventual execution onchain.

This is the final piece of the flow where after constructing your userOp and then potentially signing it with data from a paymaster, you send the userOp on chain to be handled and executed as a transaction on the EVM. You can start using our Bundlers right now in your dApps. Each of our [tutorials](/tutorials) will walk you through how to use them in different scenarios.
