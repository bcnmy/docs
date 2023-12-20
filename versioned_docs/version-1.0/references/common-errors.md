---
sidebar_position: 3
---

# Common Errors

> List of common errors faced while integrating and how to debug.

## Polyfills Issue (React.js/Next.js)

`Error example: 'crypto' not found...`

[Github](https://github.com/bcnmy/biconomy-client-sdk/issues/87)

## CSS Issue with Social Login

`Error example: Social Login modal css not loading/breaking`

Solution:

```js
import "@biconomy/web3-auth/src/style.css";
```

https://github.com/bcnmy/biconomy-client-sdk/issues/75

## Next js: document not found

`Error: document not found while using Next.js`

Solution: This happens because the code try to find the root element and create a div via DOM document, but if you are using server-side Next.js then the lib is not able to find the document. This fix is by rendering that component via the next dynamics. An example code is below and the full code setup is [here](https://github.com/bcnmy/sdk-examples/tree/master/nextjs-biconomy-web3Auth).

```js
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Index = () => {
  const SocialLoginDynamic = dynamic(
    () => import("../components/SocialLogin").then((res) => res.default),
    {
      ssr: false,
    },
  );

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SocialLoginDynamic />
      </Suspense>
    </div>
  );
};

export default Index;
```
