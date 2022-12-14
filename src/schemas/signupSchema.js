import joi from "joi";

const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.required(),
    confirmPassword: joi.required()
});
export default signupSchema;