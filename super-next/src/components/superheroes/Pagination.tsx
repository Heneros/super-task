interface Props {
               page: number
               limit: number
               total: number
               onChange: (page: number) => void
}

export default function Pagination({
               page,
               limit,
               total,
               onChange,
}: Props) {
               const totalPages = Math.max(1, Math.ceil(total / limit))
               const hasNext = page < totalPages
               const hasPrev = page > 1

               const goPrev = () => {
                              if (!hasPrev) return
                              onChange(Math.max(1, page - 1))
               }

               const goNext = () => {
                              if (!hasNext) return
                              onChange(Math.min(totalPages, page + 1))
               }

               return (
                              <div className="flex gap-4 justify-center mt-6 items-center">
                                             <button
                                                            disabled={!hasPrev}
                                                            onClick={goPrev}
                                                            className="px-4 py-2 border rounded disabled:opacity-50"
                                             >
                                                            Previous
                                             </button>

                                             <span className="font-medium">
                                                            Page {page} / {totalPages}
                                             </span>

                                             <button
                                                            disabled={!hasNext}
                                                            onClick={goNext}
                                                            className="px-4 py-2 border rounded disabled:opacity-50"
                                             >
                                                            Next
                                             </button>
                              </div>
               )
}
