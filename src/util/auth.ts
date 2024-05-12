import jwt from "jsonwebtoken";
import { Request } from "express";
export const createAccessToken = (payload: any) => {
  payload = {
    ...payload,
    type: "access",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string, type?: "access" | "refresh") => {
  try {
    if (type === "refresh") {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } else return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createRefreshToken = (payload: any) => {
  payload = {
    ...payload,
    type: "refresh",
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const createShortLivedToken = (payload: any) => {
  payload = {
    ...payload,
    type: "short-lived",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const getDecodedDataForShortLivedToken = (req: Request) => {
  const requestToken = req.headers["x-request-token"];
  if (!requestToken) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  const requestTokenData = verifyToken(requestToken as string);
  if (!requestTokenData) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  if (
    !requestTokenData.type ||
    !requestTokenData.userId ||
    requestTokenData.type != "short-lived"
  ) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  return requestTokenData;
};

export const getDecodedDataForAccessToken = (req: Request) => {
  const requestToken = req.headers["x-request-token"];
  if (!requestToken) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  const requestTokenData = verifyToken(requestToken as string);
  if (!requestTokenData) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  if (
    !requestTokenData.type ||
    !requestTokenData.userId ||
    requestTokenData.type != "access"
  ) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  return requestTokenData;
};

export const getDecodedDataForRefreshToken = (req: Request) => {
  const requestToken = req?.body.refreshToken;
  if (!requestToken) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  const requestTokenData = verifyToken(requestToken as string, "refresh");
  if (!requestTokenData) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  if (
    !requestTokenData.type ||
    !requestTokenData.userId ||
    requestTokenData.type != "refresh"
  ) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  return requestTokenData;
};
