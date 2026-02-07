import { useDeleteSuperHeroImageMutation, useSetSuperHeroMainImageMutation } from "@/redux/superheroes/superheroesApi"




export default function SuperheroGallery({ images }: { images: any[] }) {
  const [deleteImage] = useDeleteSuperHeroImageMutation()
  const [setMain] = useSetSuperHeroMainImageMutation()


  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Gallery</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.publicId}
            className={`
  relative rounded-xl overflow-hidden
  border border-white/10
  transition hover:scale-[1.02]
  ${img.isMain ? 'ring-2 ring-emerald-500' : ''}
`}>
            <img
              src={img.posterUrl}
              className="w-full h-40 object-cover"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex gap-2 items-center justify-center transition">
              {!img.isMain && (
                <button
                  onClick={() => setMain(img.publicId)}
                  className="px-2 py-1 bg-green-500 text-white text-sm rounded"
                >
                  Make main
                </button>
              )}

              <button
                onClick={() => deleteImage(img.publicId)}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
