const wbtoken = require('jsonwebtoken');

async function logged(req, res, next) {
    let Auth = req.cookies.Token || null;

    if(typeof(Auth) == 'undefined' || Auth === '' || Auth == null) {

        return res.redirect('/login');
    }
    else {
        try {
            Token = await wbtoken.verify(Auth, process.env.WBTOKEN_PASS);
            next();
        }
        catch (err) {
            return res.redirect('/login');
        }
    }
}

module.exports = logged;