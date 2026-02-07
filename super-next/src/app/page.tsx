"use client";


import { useGetSuperHeroesQuery } from "@/redux/superheroes/superheroesApi";
import { useState, useEffect } from "react";
import SuperHeroCard from '../components/superheroes/SuperHeroCard';
import Pagination from '../components/superheroes/Pagination';
import Link  from 'next/link';

export default function Home() {

    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetSuperHeroesQuery({ page });

    useEffect(() => {
        if ( data?.page  && data.page !== page) {
            setPage(data.page);
        }
    }, [data?.page]);

    if (isLoading) {
        return <div className="p-10 text-center">Loading...</div>;
    }


    return (<div className="p-6 max-w-6xl mx-auto">
    <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold mb-6 text-center">
            Superheroes
        </h1>
        <Link href="/superheroes/add" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white mb-4">
            Add New Superhero
        </Link>
    </div>
   
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {data?.data?.map((hero) => (

                <SuperHeroCard key={hero.id} hero={hero} />
            ))}
        </div>
        {data &&(
            <Pagination
            page={page}
       
            limit={data?.limit || 5}
            total={data?.total || 0}
            onChange={(newPage) => setPage(newPage)}
           
        />
        )}
        
    </div>

    )

}
