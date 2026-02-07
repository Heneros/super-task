"use client";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
import { SuperHero } from "@/interfaces/superhero.interface";
import {

  useDeleteSuperHeroMutation,
  useUpdateSuperHeroMutation,
} from "@/redux/superheroes/superheroesApi";

const Schema = Yup.object({
  nickname: Yup.string().required("Required"),
  catch_phrase: Yup.string().required("Required"),
  origin_description: Yup.string().required("Required"),
  superpowers: Yup.string().required("Required"),
});

export default function SuperheroInfo({ hero }: { hero: SuperHero }) {
  const navigate = useRouter()
  const [isEdit, setIsEdit] = useState(false);
  const [updateHero, { isLoading: isUpdating }] = useUpdateSuperHeroMutation();
  const [deleteHero, { isLoading: isDeleting }] = useDeleteSuperHeroMutation();

  const onDelete = async () => {
    let superHeroId = hero.id;
    if (!confirm("Delete this superhero?")) return;
                 await deleteHero(hero.id);
    alert("Product was deleted");
    navigate.push('/')
  };

  if (!isEdit) {
    return (
      <div className="relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 shadow-xl">
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-red-500 hover:text-red-600"
        >
          {isDeleting ? "Deleting..." : "🗑 Delete"}
        </button>

        <h1 className="text-3xl font-bold">{hero.nickname}</h1>
        <p className="mt-2 text-gray-400 italic">{hero.catch_phrase}</p>

        <div className="mt-4 space-y-2 text-gray-300">
          <p>
            <b>Origin:</b> {hero.origin_description}
          </p>
          <p>
            <b>Powers:</b>
            {Array.isArray(hero.superpowers)
              ? hero.superpowers.join(", ")
              : hero.superpowers}
          </p>
        </div>

        <button
          onClick={() => setIsEdit(true)}
          className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    );
  }

  const initialValues = {
    nickname: hero.nickname,
    catch_phrase: hero.catch_phrase,
    origin_description: hero.origin_description,
    superpowers: Array.isArray(hero.superpowers)
      ? hero.superpowers.join(", ")
      : hero.superpowers,
  };

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 shadow-xl">
      <Formik
        initialValues={initialValues}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              ...values,
              superpowers: values.superpowers
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
            };

            await updateHero({
              superheroId: hero.id,
              body: payload,
            }).unwrap();

            setIsEdit(false);
          } catch (error) {
            console.error("Update failed:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="nickname"
                placeholder="Nickname"
                className="w-full px-4 py-2 rounded bg-black/30 border"
              />
              {errors.nickname && touched.nickname && (
                <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
              )}
            </div>

            <div>
              <Field
                name="catch_phrase"
                placeholder="Catch phrase"
                className="w-full px-4 py-2 rounded bg-black/30 border"
              />
              {errors.catch_phrase && touched.catch_phrase && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.catch_phrase}
                </p>
              )}
            </div>

            <div>
              <Field
                name="origin_description"
                as="textarea"
                placeholder="Origin description"
                className="w-full px-4 py-2 rounded bg-black/30 border min-h-[100px]"
              />
              {errors.origin_description && touched.origin_description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.origin_description}
                </p>
              )}
            </div>

            <div>
              <Field
                name="superpowers"
                as="textarea"
                placeholder="Superpowers (comma separated)"
                className="w-full px-4 py-2 rounded bg-black/30 border min-h-[100px]"
              />
              <p className="text-sm text-gray-400 mt-1">
                Enter powers separated by commas: Flight, Super strength, Heat
                vision
              </p>
              {errors.superpowers && touched.superpowers && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.superpowers}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || isUpdating}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting || isUpdating ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => setIsEdit(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                disabled={isSubmitting || isUpdating}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
