import * as Yup from 'yup'

export const superheroSchema = Yup.object({
  nickname: Yup.string()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('Nickname is required'),

  origin_description: Yup.string()
    .min(10, 'Minimum 10 characters')
    .required('Origin is required'),

  catch_phrase: Yup.string()
    .min(3, 'Too short')
    .required('Catch phrase is required'),

  superpowers: Yup.string()
    .required('Superpowers required'),
})
