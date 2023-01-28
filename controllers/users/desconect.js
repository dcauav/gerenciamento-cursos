async function desconect(res) {
    res.clearCookie('Token');
    res.redirect('/login');
}

module.exports = desconect;