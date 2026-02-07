import { configureStore } from '@reduxjs/toolkit';
// import { superheroesApi } from '@/features/superheroes/superheroes.api';
import baseApiSlice from './baseApi';

export const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
//     [superheroesApi.reducerPath]: superheroesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
