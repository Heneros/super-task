import { Field, ErrorMessage } from 'formik'

export function Input({
               name,
               label,
}: {
               name: string
               label: string
}) {
               return (
                              <div>
                                             <label className="block mb-1 text-sm text-white/70">
                                                            {label}
                                             </label>

                                             <Field
                                                            name={name}
                                                            className="w-full rounded-lg bg-black/40 p-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             />

                                             <ErrorMessage
                                                            name={name}
                                                            component="div"
                                                            className="text-red-400 text-sm mt-1"
                                             />
                              </div>
               )
}
