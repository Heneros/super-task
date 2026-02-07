import { SuperHero } from "@/interfaces/superhero.interface";
import baseApiSlice from "../baseApi";

export const superHeroesSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuperHeroes: builder.query({
      query: ({ page = 1 }) => ({
        url: '/superheroes',
        params: { page },
      }),
      providesTags: ['SuperHero'],
    }),
    getSuperHeroById: builder.query<any, number>({
      query: (superheroId) => `/superheroes/${superheroId}`,
      providesTags: (_res, _err, id) => [{ type: 'SuperHero', id }],
    }),
    createSuperHero: builder.mutation<any, any>({
      query: (body) => ({
        url: '/superheroes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SuperHero'],
    }),
    updateSuperHero: builder.mutation({
      query: ({ superheroId, body }) => ({
        url: `/superheroes/${superheroId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (res, err, { superheroId }) => [
        { type: 'SuperHero', id: superheroId },
            { type: 'SuperHeros', id: 'LIST' },
      ],
    }),
    deleteSuperHero: builder.mutation({
      query: (superheroId) => ({
        url: `/superheroes/${superheroId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SuperHeros', 'SuperHero'],
    }),

      uploadSuperHeroImage: builder.mutation({
      query: ({ superheroId, file }) => {
        const formData = new FormData()
        formData.append('image', file)

        return {
          url: `/superheroes/update-image/${superheroId}`,
          method: 'PATCH',
          body: formData,
        }
      },
        invalidatesTags: (result, error, { superheroId }) => [
        { type: 'SuperHero', id: superheroId }
        
      ],
    }),
    deleteSuperHeroImage: builder.mutation<any, string>({
      query: (publicId) => ({
        url: `/superheroes/delete-image/${publicId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SuperHero'],
    }),
    setSuperHeroMainImage: builder.mutation<any, string>({
      query: (publicId) => ({
        url: `/superheroes/set-image/${publicId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SuperHero'],
    }),
    getSuperheroById: builder.query<SuperHero, number>({
      query: (id) => `/superheroes/${id}`,
    }),

    getSuperheroImages: builder.query<any[], number>({
      query: (id) => `/superheroes/images/${id}`,
    }),
  }),
});

export const {
  useGetSuperHeroesQuery,
  useGetSuperHeroByIdQuery,

  useCreateSuperHeroMutation,
  useUpdateSuperHeroMutation,
  useDeleteSuperHeroMutation,

  useUploadSuperHeroImageMutation,
  useDeleteSuperHeroImageMutation,
  useSetSuperHeroMainImageMutation,
  useGetSuperheroByIdQuery,
useGetSuperheroImagesQuery
} = superHeroesSlice;
