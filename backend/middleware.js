const { JWT_SECRET } = require("./config");//JWT_SECRET is a secret key used to sign and verify JWT tokens
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Check if the request has an authorization header and if it starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];
    // Verify the JWT token using the secret key
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Check if the token is valid and contains a userId
        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }
        else{
            return res.status(403).json({});
        }
        

        
    } catch (err) {
        console.log("tocken")
        return res.status(403).json({});
    }
};

module.exports = {
    authMiddleware
}