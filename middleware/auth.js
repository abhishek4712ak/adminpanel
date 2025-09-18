import jwt from "jsonwebtoken";



//middleware to verify ADMIN routes

export function verifyAdmin(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.log("ADMIN Verify Error!", err);
        return res.redirect(302, "/login");
      }
      if (authData.role === "admin") {
        req.user = authData;
        console.log("ADMIN Verified!", authData);
        return next();
      } else {
        console.log("ADMIN Verify Error! Not admin role.");
        return res.redirect(302, "/login");
      }
    });
  } else {
    return res.redirect(302, "/");
  }
}



export async function isAdminLoggedIn(req, res, next) {
  const token = await req.cookies.jwt;
  if (token) {
    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err && decoded.role === "admin") {
        req.user = decoded;
        return next();
      }
      next();
    });
  } else {
    next();
  }
}


