"use client"
import React, { useEffect, useState } from 'react'
import EventCard from './Eventcard';
import EventCardSkeleton from './EventCardSkeleton';
import EmptyState from './EmptyState';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

interface CardGridProps {
  search: string
}

function CardGrid({ search }: CardGridProps) {
  const fetchData = async () => {
    const url = search.length > 0
      ? `/api/events?search=${search}`
      : '/api/events';
    const res = await fetch(url);
    const json = await res.json();
    return json
  }
  const { data, isFetched, isFetching, isError, error } = useQuery({
    queryKey: ['events', search],
    queryFn: () => fetchData(),
  })
  if (isError) {
    console.error("Error occured in Client:", error.message)
  }
  return (
    <>

      <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {isFetching ? (
          Array.from({ length: 4 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))
        ) : data.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          //TODO: Add Type safety later
          data.map((item: any, index: number) => (
            <Link key={index} href={`/events/${item.id}`}>
              <EventCard event={item} />
            </Link>
          ))
        )}
      </div>
      <div className="text-sm text-gray-400 text-center py-10">WOW!! You discovered all Events</div>
    </>
  )
}

export default CardGrid