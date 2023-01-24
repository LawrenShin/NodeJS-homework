import Joi from "joi";

export const userSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    age: Joi.number()
        .min(4)
        .max(130)
        .required()
});