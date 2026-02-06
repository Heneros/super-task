export const SUPERHEROES_CONTROLLER = 'superheroes' as const;

export const SUPERHEROES_ROUTES = {
  GET_ALL: '',
  GET_ID_SUPERHERO: ':superheroId',
  CREATE_SUPERHERO: '',
  UPDATE_SUPERHERO: ':superheroId',
  DELETE_SUPERHERO: ':superheroId',
  UPDATE_SUPERHERO_IMAGE: 'update-image/:superheroId',
 
  SET_SUPERHERO_IMAGE: 'set-image/:publicId',
  DELETE_SUPERHERO_IMAGE: 'delete-image/:publicId',
} as const;
