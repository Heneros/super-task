"use client";

import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { useCreateSuperHeroMutation, useUploadSuperHeroImageMutation } from '@/redux/superheroes/superheroesApi';
import { useState } from 'react';
import Link from 'next/link'

import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

export const createSuperHeroSchema = Yup.object({
  nickname: Yup.string().required('Nickname is required'),
  origin_description: Yup.string().required('Origin description is required'),
  superpowers: Yup.array()
    .of(Yup.string().required('Superpower cannot be empty'))
    .min(1, 'At least one superpower is required'),
  catch_phrase: Yup.string().required('Catch phrase is required'),
});

export const initialValues = {
  nickname: '',
  origin_description: '',
  superpowers: [''],
  catch_phrase: '',
};



export default function CreateSuperHeroForm() {
  const navigate = useRouter()
  const [createSuperHero, { isLoading }] = useCreateSuperHeroMutation();
  const [uploadImage] = useUploadSuperHeroImageMutation();
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
    
      const hero = await createSuperHero(values).unwrap();


      if (images.length) {
        await Promise.all(
          images.map((file) =>
            uploadImage({ superheroId: hero.id, file }).unwrap()
          )
        );
      }

      resetForm();
      setImages([]);


      alert('Superhero created successfully!');
navigate.push('/')
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded">
        <div className="flex flex-col justify-start items-center">
      <h2 className="text-2xl font-bold mb-4">Create Superhero</h2>
      <Link href="/">Back</Link>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={createSuperHeroSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-4">
       
            <div>
              <Field
                name="nickname"
                placeholder="Nickname"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage name="nickname" component="div" className="text-red-500 text-sm" />
            </div>

           
            <div>
              <Field
                name="origin_description"
                placeholder="Origin description"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage name="origin_description" component="div" className="text-red-500 text-sm" />
            </div>

   
            <FieldArray name="superpowers">
              {({ push, remove }) => (
                <div className="space-y-2">
                  <label className="font-medium">Superpowers</label>

                  {values.superpowers.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <Field
                        name={`superpowers.${index}`}
                        placeholder="Superpower"
                        className="flex-1 border p-2 rounded"
                      />
                      {values.superpowers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="px-2 border rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => push('')}
                    className="text-sm underline"
                  >
                    + Add superpower
                  </button>

                  <ErrorMessage name="superpowers" component="div" className="text-red-500 text-sm" />
                </div>
              )}
            </FieldArray>

            <div>
              <Field
                name="catch_phrase"
                placeholder="Catch phrase"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage name="catch_phrase" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block font-medium mb-1">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setImages(Array.from(e.target.files));
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
