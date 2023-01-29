const schema = require('../../schemas/courses.js');

async function getCourInfo (res, id) {
    const info = await schema.findCour(id);
    res.send(info);
}

async function getCourList (res, page) {
    const list = await schema.findCourList(page);
    res.send(list);
}

module.exports = {
    getCourInfo,
    getCourList
}
