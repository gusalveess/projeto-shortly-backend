import joi from "joi";

const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

const urlSchema = joi.object({
    url: joi.string().pattern(pattern).required()
});
export default urlSchema;