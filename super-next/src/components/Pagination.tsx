
interface Props {
               page: number;
               onChange: (page: number) => void;
               hasNext: boolean;
}


export default function Pagination({ page, onChange, hasNext }: Props) {
               return (<div className="flex gap-4 justify-center mt-6">
                              <button disabled={page === 1}
                                             onClick={() => onChange(page - 1)}
                                             className="px-4 py-2 border rounded disabled:opacity-50"
                             >
                                             Previous
                              </button>

                              <span className="font-medium">Page {page}</span>
                              <button
                                             disabled={!hasNext}
                                             onClick={() => onChange(page + 1)}
                                             className="px-4 py-2 border rounded disabled:opacity-50"
                              >
                                             Next
                              </button>
               </div>)
}