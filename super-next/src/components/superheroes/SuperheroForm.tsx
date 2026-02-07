
'use client'

import { superheroSchema } from '@/_data/validationSchema'
import { useCreateSuperHeroMutation, useUpdateSuperHeroMutation } from '@/redux/superheroes/superheroesApi'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Input } from '../ui/Input'

type Props = {
  superheroId?: number
  initialData?: any
  onSuccess?: () => void
}



export default function SuperheroForm({
  superheroId,
  initialData,
  onSuccess,
}: Props) {
  const [createHero] = useCreateSuperHeroMutation()
  const [updateHero] = useUpdateSuperHeroMutation()

  const initialValues = {
    nickname: initialData?.nickname || '',
    origin_description: initialData?.origin_description || '',
    catch_phrase: initialData?.catch_phrase || '',
    superpowers: initialData?.superpowers?.join(', ') || '',
  }

  return (<Formik
    initialValues={initialValues}
    validationSchema={superheroSchema}
    enableReinitialize
    onSubmit={async (values, { resetForm }) => {
      const payload = {
        ...values,
        superpowers: values.superpowers
          .split(',')
          .map((p) => p.trim()),
      }
      if (superheroId) {
        await updateHero({
          superheroId: superheroId,
          data: payload,
        }).unwrap()
      } else {
        await createHero(payload).unwrap()
        resetForm()
      }

      onSuccess?.()
    }}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">

        <h2 className="text-xl font-semibold">
          {superheroId ? 'Update superhero' : 'Create superhero'}
        </h2>

        <Input name="nickname" label="Nickname" />
        <Input name="origin_description" label="Origin" />
        <Input name="catch_phrase" label="Catch phrase" />
        <Input
          name="superpowers"
          label="Superpowers (comma separated)"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg"
        >
          {superheroId ? 'Update' : 'Create'}
        </button>

      </Form>
    )}
  </Formik>)

}