import jwt from "jsonwebtoken";
// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startWith(`Bearer`)) {
    return res.status(401).json({
      message: "Token has invalid format",
    });
  }

  const tokenWithOutBearer = token.spilt(" ")[1];

  jwt.verify(tokenWithOutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    }
    req.user = payload;
    next();
  });
};
