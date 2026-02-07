"use client";

import { useGetSuperHeroesQuery } from "@/redux/superheroes/superheroesApi";
import { useState } from "react";
import SuperHeroCard from '../../components/superheroes/SuperHeroCard';
import Pagination from '../../components/Pagination';

export default function SuperHeroesPage() {
               const [page, setPage] = useState(1);
               const { data, isLoading } = useGetSuperHeroesQuery({ page });


               if (isLoading) {
                              return <div className="p-10 text-center">Loading...</div>;
               }



               return (<div className="p-6 max-w-6xl mx-auto">
                              <h1 className="text-3xl font-bold mb-6 text-center">
                                             Superheroes
                              </h1>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                                             {data.map((hero) => (

                                                            <SuperHeroCard key={hero.id} hero={hero} />
                                             ))}
                              </div>
                              <Pagination
                                             page={page}
                                             onChange={setPage}
                                             hasNext={data.length === 5}
                              />
               </div>

               )
}