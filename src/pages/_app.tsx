import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import Container from "../components/Container";

import { api } from "../utils/api";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main>
        <Container>
          <Component {...pageProps} />
        </Container>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
