import jwt from 'jsonwebtoken'
const secretJWT = process.env.SECRET_JWT;

const { verify } = jwt;

const verifyJWT = (req, res, next) => {
    try {
        const token = req.get('Authorization');
        
        verify(token, secretJWT, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    message: "error al validar token",
                    error: err.message
                });
            }

            req.user = decode.user;
            next();
        });
    } catch (error) {
        
        return res.status(401).json({
            message: "error al validar token",
            error: error.message
        });
    }
}

export { verifyJWT as httpAuthMiddleware };