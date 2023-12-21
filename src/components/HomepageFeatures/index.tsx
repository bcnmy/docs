import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  to: string;
  // Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy onboarding",
    to: "/docs/intro",
    description: (
      <>
        Leverage smart accounts to onboard anyone to your dApp in seconds. Offer
        easy-to-use social logins & fiat on-ramps. Works seamlessly for
        mainstream and native web3 users.
      </>
    ),
  },
  {
    title: "Simplify Transactions",
    to: "/docs/intro",
    description: (
      <>
        Leverage paymasters to offer gasless transactions, accept gas in any
        ERC20 tokens, and eliminate failed transactions. All you need is a
        simple user signature
      </>
    ),
  },
  {
    title: "Remove Friction",
    to: "/docs/intro",
    description: (
      <>
        Leverage account abstraction to handle web3 actions on behalf of your
        users in a non-custodial way. Build custom authorisation & session logic
        to reduce the constant need for user signature.
      </>
    ),
  },
];

function Feature({ title, to, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {/* <div className="text--center">
      <Link
            className="button button--secondary button--lg"
            to={to}>
            Get Started Now
          </Link>
      </div> */}
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
