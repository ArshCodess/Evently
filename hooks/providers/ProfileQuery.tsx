import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'

function ProfileQueryProvider({ children }: {children:React.ReactNode}) {

    const client = new QueryClient({
        defaultOptions:{
            queries:{
                staleTime:5*60*1000,
            }
        }
    });

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}

export default ProfileQueryProvider