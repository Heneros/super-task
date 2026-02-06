import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    nickname: Yup.string().min(2).required(),
    origin_description: Yup.string().required().min(10).max(350),   catch_phrase: Yup.string().required().min(10).max(150),
    superpowers: Yup.string().required().min(10).max(250),
    // publish: Yup.boolean(),
});
