const asyncHandler = require('express-async-handler');
const supabase = require('../lib/supabase');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // MODIFIED: Verify token using jsonwebtoken instead of supabase auth
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from Supabase using decoded ID
            const { data: user, error } = await supabase
                .from('User')
                .select('id, username')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Middleware auth error:', error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
