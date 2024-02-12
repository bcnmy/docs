---
sidebar_label: "Introduction"
sidebar_position: 1
---

# Introduction

The session storage module provides a way to create sessions for an App, where users can make use of the session for signing purpose. These session keys are stored on chain, and information for each leaf is stored in offchain data storage. By default it gets stored in the browser local storage. This tutorial covers how one can create a custom Session storage for their Dapps. It can be a database or file. In this we will go over the implementation of the File storage for their session leaf.
:::tip

Check out an end-to-end integration of custom session storage [repo](https://github.com/bcnmy/custom-session-storage-tutorial)!

:::

In this tutorial we will:

- Create File based custom session storage client, which will be used to save the session keys and signers
- Go over a smart contract that allows for sessions to be validated for ERC20 token transfers.
- Go over initilization and creation of a session module in Node JS.
- Execute a basic ERC20 token transfer without the need to sign
