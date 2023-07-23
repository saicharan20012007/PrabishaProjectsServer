const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  jwt.verify(token, "3179d9abf280133c55b448e42dae5684c8ec56d63790403aa3c36d75d79f2ef96febebb890f2ac6484db3a6d6ab139dc74824a38e4b4b42cc36b697d0622bd74", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" })
    }

    req.user = user
    next()
  })
}

module.exports = authenticateToken
