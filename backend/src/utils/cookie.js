export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
}

export function getSignedCookieOptions() {
  return {
    ...getCookieOptions(),
    signed: true,
  };
}

export function setCookie(res, name, value, options) {
  res.cookie(name, value, { ...getCookieOptions(), ...options });
}

export function setSignedCookie(res, name, value, options) {
  res.cookie(name, value, { ...getSignedCookieOptions(), ...options });
}

export function clearCookie(res, name, options) {
  res.clearCookie(name, { ...getCookieOptions(), ...options });
}

export function clearSignedCookie(res, name, options) {
  res.clearCookie(name, { ...getSignedCookieOptions(), ...options });
}

export function getCookie(req, name) {
  return req.cookies[name];
}

export function getSignedCookie(req, name) {
  return req.signedCookies[name];
}

export function getAllCookies(req) {
  return req.cookies;
}

export function getAllSignedCookies(req) {
  return req.signedCookies;
}

export function hasCookie(req, name) {
  return req.cookies.hasOwnProperty(name);
}

export function hasSignedCookie(req, name) {
  return req.signedCookies.hasOwnProperty(name);
}

export function getClearCookieOptions() {
  return {
    ...getCookieOptions(),
    expires: new Date(0),
  };
}

export function getClearSignedCookieOptions() {
  return {
    ...getSignedCookieOptions(),
    expires: new Date(0),
  };
}

export default {
  setCookie,
  clearCookie,
  getCookie,
  getSignedCookie,
  getAllCookies,
  getAllSignedCookies,
  hasCookie,
  hasSignedCookie,
  getCookieOptions,
  getSignedCookieOptions,
  getClearCookieOptions,
  getClearSignedCookieOptions,
};