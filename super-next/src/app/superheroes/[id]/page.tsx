'use client'

import SuperheroInfo from '@/components/superheroes/SuperheroActions'
import SuperheroGallery from '@/components/superheroes/SuperheroGallery'
import SuperheroImageUpload from '@/components/superheroes/SuperheroInfo'
import { useGetSuperheroByIdQuery, useGetSuperheroImagesQuery } from '@/redux/superheroes/superheroesApi'
import Link from 'next/link'
import { useParams } from 'next/navigation'


export default function SuperheroPage() {
               const { id } = useParams()
               const superheroId = Number(id)

               const { data: hero, isLoading } =
                              useGetSuperheroByIdQuery(superheroId, {
                                             pollingInterval: 5000, 
                                             refetchOnFocus: true,  
                                             refetchOnReconnect: true, 
                              })

               const { data: images } =
                              useGetSuperheroImagesQuery(superheroId, {
                                             pollingInterval: 5000,
                                             refetchOnFocus: true,
                                             refetchOnReconnect: true,
                              })

               if (isLoading) return <div>Loading...</div>
               if (!hero) return <div>Not found</div>

               return (
                              <div className="max-w-5xl mx-auto p-6 space-y-6">
                                             <Link href="/" className="text-blue-400 hover:underline">
                                                            Back
                                             </Link>
                                             <SuperheroInfo hero={hero} />
                                             <SuperheroImageUpload superheroId={superheroId} />

                                             <SuperheroGallery images={images || []} />
                              </div>
               )
}
