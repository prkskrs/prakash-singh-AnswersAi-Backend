import Joi from "joi";

const authRoutesSchemas = {
  login: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
    body: Joi.object().keys({
      email: Joi.string().email().required(),
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
  logout: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
  },
  getRefreshToken: {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  },
};

const userRoutesSchemas = {
  getMe: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
  },
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
