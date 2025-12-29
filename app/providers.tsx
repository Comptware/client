// // app/providers.tsx
"use client";

import { ReactNode, useState } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store/store";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { Session } from "@/types";
import { PreloadAuth } from "./PreloadAuth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartInitializer from "./CartInitializer";
import FreshchatLoader from "@/components/Chat/FreshchatLoader";

export interface ProvidersProps {
  children: ReactNode;
  session?: Session;
  themeProps?: ThemeProviderProps;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RiKCKPCgqxW33UvVkBBeIv2ix3c6a0Q8mC4UjvOF40edAAVwVqc4w1YaB4ItdlCpfGPvRjBPRf5KquyAMhUYOEm00jM76fkJ7"
);

export function Providers({ children, session, themeProps }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: true,
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <Auth0Provider>
      <Elements stripe={stripePromise}>
        <ReduxProvider store={store}>
          <PreloadAuth session={session!} />
          <FreshchatLoader />
          <CartInitializer>
            <QueryClientProvider client={queryClient}>
              <NextUIProvider>
                <NextThemesProvider
                  defaultTheme="system"
                  attribute="class"
                  {...themeProps}
                >
                  {children}

                  <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                  />
                </NextThemesProvider>
              </NextUIProvider>
            </QueryClientProvider>
          </CartInitializer>
        </ReduxProvider>
      </Elements>
    </Auth0Provider>
  );
}
