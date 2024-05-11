import Joi from "joi";

const authRoutesSchemas = {
  login: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
    body: Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
      password: Joi.string().required(),
    }),
  },
  signup: {
    body: Joi.object().keys({
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    }),
  },
};

const userRoutesSchemas = {
  updateMe: {
    body: Joi.object().keys({
      user: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
      }).required(),
    }),
  },
};

const requestSchemas = {
  authRoutesSchemas,
  userRoutesSchemas,
};

export default requestSchemas;
