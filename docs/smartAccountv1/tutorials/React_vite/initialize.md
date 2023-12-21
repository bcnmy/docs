---
sidebar_position: 4
---

# Initialize Frontend

Now it is time to work on our Frontend. We will be using React and Vite to build
this to keep our frontend simple and the default React and Vite template
actually gives us a nice Counter button UI to connect with our contract.

You can learn more about how to set up this frontend
[here](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) or just
follow the instructions below.

With NPM:

```bash
npm create vite@latest
```

With Yarn:

```bash
yarn create vite
```

With PNPM:

```bash
pnpx create vite
```

You can follow the prompts to receive the scaffolding for your React
application. You can use any of the package managers of your choice, but to keep
things simple we will be using Yarn from this point.

Install the following dependencies:

```bash
yarn add
    @biconomy/account
    @biconomy/bundler
    @biconomy/common
    @biconomy/core-types
    @biconomy/paymaster
    @biconomy/web3-auth
    @biconomy/node-client -S
```

We will use these tools to build out our front end. In addition, lets also
install the following devDependencies:

```bash
yarn add @esbuild-plugins/node-globals-polyfill rollup-plugin-polyfill-node stream-browserify -D
```

After installing the above dependencies update you vite.config.ts to the
following:

```js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      util: "util",
    },
  },
});
```
