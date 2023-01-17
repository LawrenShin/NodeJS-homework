// schemas
const Joi = require("joi");
const userSchema = Joi.object({
    id: Joi.number().default(Math.random()),
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    kills: Joi.number()
        .min(4)
        .max(130)
        .required(),
});

module.exports = userSchema;