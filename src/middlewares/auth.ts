import jsonwebtoken from 'jsonwebtoken';

export const tokenValidation = (req, res, next) => {

    const token = req.get('token');

    jsonwebtoken.verify(token, process.env.SECRET, (err, decoded) => {

        if(err){
            return res.status(401).json({

                ok: false,
                message: err

            });
        }

        req.user = decoded.user;
        next();

    });

}