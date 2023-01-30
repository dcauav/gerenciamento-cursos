const wbtoken = require('jsonwebtoken');

async function tokendata(req, res) {
    let Auth = req.cookies.Token || null;

    if(typeof(Auth) == 'undefined' || Auth === '' || Auth == null) {
        return res.redirect('/login');
    }
    else {
        try {
            return wbtoken.decode(Auth);
        }
        catch (err) {
            return res.redirect('/login');
        }
    }
}

module.exports = tokendata;