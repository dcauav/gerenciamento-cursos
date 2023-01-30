const schema = require('../../schemas/courses.js');


async function getCourInfo (res, id) {
    const info = await schema.findCour(id);
    res.send(info);
}

async function getCourList (res) {
    const list = await schema.findCourList();
    res.send(list);
}

async function getCourSearch (res, search) {
    const list = await schema.findCourSearch(search);
    res.send(list);
}

module.exports = {
    getCourSearch,
    getCourInfo,
    getCourList
}
