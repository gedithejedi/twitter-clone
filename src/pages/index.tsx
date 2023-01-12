import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Timeline } from "../components/Timeline";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const {data: session} = useSession();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Hello from TRPC</h1>
        <button onClick={() => signIn()}>Login</button>
        <Timeline />
      </div>
    </>
  );
};

export default Home;
