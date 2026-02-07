import {
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

const baseApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        prepareHeaders: (headers, { getState }) => {
        },
    }),
    
    tagTypes: ['SuperHero', 'SuperHeros'] as const,
    endpoints: (builder) => ({}),
});

export default baseApiSlice;
