"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

function Providers({ children }: React.PropsWithChildren): JSX.Element {
    const [client] = React.useState(
        new QueryClient({ defaultOptions: { queries: { retry: 1, retryDelay: 5000, refetchOnMount: true, refetchOnWindowFocus: false, staleTime: 0 } } })
    );

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} position="left" buttonPosition="bottom-left" />
        </QueryClientProvider>
    );
}

export default Providers;
