// import { sign, verify } from "jsonwebtoken";
import pkg from "jsonwebtoken";

const { sign, verify } = pkg;

export function createToken(user) {
  const accessToken = sign(
    {
      user_name: user.user_name,
      user_id: user.user_id,
    },
    "jwtsecret"
  );
  return accessToken;
  ``;
}

export function validateToken(req, res, next) {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(400).json({ error: "User not authenticated" });
  }
  try {
    const validToken = verify(accessToken, "jwtsecret");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
}
