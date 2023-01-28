async function desconect(res) {
    res.clearCookie('Token');
    res.redirect('/login');
}

exports.module = desconect;