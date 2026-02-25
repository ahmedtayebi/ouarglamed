// PATH: server/src/controllers/auth.controller.js
const asyncHandler = require('express-async-handler');
const supabase = require('../lib/supabase'); // MODIFIED: replaced Prisma with Supabase

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // MODIFIED: replaced Prisma with Supabase
    const { data: user, error } = await supabase
        .from('User') // MODIFIED: replaced Prisma with Supabase
        .select('*') // MODIFIED: replaced Prisma with Supabase
        .eq('username', username) // MODIFIED: replaced Prisma with Supabase
        .limit(1)
        .maybeSingle(); // MODIFIED: use maybeSingle to prevent coercion errors on 0 rows

    // ADDED: error handling
    if (error) throw error;



    // ADDED: require bcrypt
    const bcrypt = require('bcrypt');
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    // ADDED: debug logs
    console.log('=== LOGIN DEBUG ===');
    console.log('username received:', username);
    console.log('password received:', password);
    console.log('user from DB:', user);
    console.log('bcrypt compare result:', isMatch);

    const fs = require('fs');
    fs.appendFileSync('auth_debug.log', new Date().toISOString() + ' -> ' + JSON.stringify({ username, password, foundUser: !!user, isMatch }) + '\\n');

    if (!user || !isMatch) {
        res.status(401);
        throw new Error('Invalid username or password');
    }

    // MODIFIED: replaced static string with real JWT token
    const jwt = require('jsonwebtoken'); // ADDED: require jsonwebtoken
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
        id: user.id,
        username: user.username,
        token // MODIFIED: replaced static token with signed JWT
    });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(req.user);
});

module.exports = { loginUser, getProfile };

// ✅ Done: auth.controller.js
