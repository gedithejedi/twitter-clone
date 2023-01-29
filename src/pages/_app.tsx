import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import Container from "../components/Container";

import { api } from "../utils/api";

import "../styles/globals.css";
import LoggedOutBanner from "../components/LoggedOutBanner";
// import {ReactQueryDevTools} from "@tanstack/react-query-dev-tools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Container>
          <main>
            <Component {...pageProps} />
          </main>
        </Container>
        <LoggedOutBanner/>
      </SessionProvider>

      <ReactQueryDevtools initialIsOpen={false}/>
    </>

  );
};

export default api.withTRPC(MyApp);
