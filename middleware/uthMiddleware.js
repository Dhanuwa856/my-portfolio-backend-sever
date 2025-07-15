import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Optionally restrict to admin only
    if (req.user.type !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
