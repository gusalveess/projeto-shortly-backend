import joi from "joi";

const signupSchema = joi.object({
   email: joi.string().required(),
   password: joi.required()
});
export default signupSchema;