const schema = require('../../schemas/courses.js');

async function switch_c (data, res){
    return await schema.switchCour(data)
}

module.exports = switch_c