import Layout from "@/components/layout";
import { useStore } from "@/store/useStore";
import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const { initializeAuth } = useStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>
    <Head>
      <title>Blog Platform</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href="/favicon.ico" />

      <meta name="description" content="A simple blog platform built with Next.js and Tailwind CSS." />
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>

  </>
}
