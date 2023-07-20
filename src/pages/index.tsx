import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { useColorMode } from '@docusaurus/theme-common';
import Head from '@docusaurus/Head';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const { isDarkTheme } = useColorMode();

  const heroTitleClass = clsx({
    [styles.lightHeroTitle] : !isDarkTheme,
    [styles.heroTitle] : isDarkTheme
})

const subTitleClass = clsx({
  [styles.lighSubTitle] : !isDarkTheme,
  [styles.subtitle] : isDarkTheme
})
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={heroTitleClass}>{siteConfig.title}</h1>
        <p className={subTitleClass}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quickstart">
            Get Started Now
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`The Biconomy SDK`}
      description="Documentation, tutorials, and guides for implmentation of the Biconomy SDK">
      <Head>
        <meta prefix="og: http://ogp.me/ns#" /> 
      </Head>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
