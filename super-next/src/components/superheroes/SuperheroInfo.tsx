import { useUploadSuperHeroImageMutation } from "@/redux/superheroes/superheroesApi"

export default function SuperheroImageUpload({
               superheroId,
}: {
               superheroId: number
}) {
               const [uploadImage, { isLoading }] =
                              useUploadSuperHeroImageMutation()

               const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const file = e.target.files?.[0]
                              if (!file) return

                              await uploadImage({ superheroId, file })
                              // e.target.value = ''

               }

               return (
                              <label className="block">
                                             <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={onChange}
                                             />
                                             <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
                                                            {isLoading ? 'Uploading...' : 'Upload image'}
                                             </span>
                              </label>
               )
}
