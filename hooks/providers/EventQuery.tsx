"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react'

function QProvider({
    children
}:{
    children:ReactNode
}) {
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

export default QProvider;