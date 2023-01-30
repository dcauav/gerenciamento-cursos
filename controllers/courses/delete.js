const schema = require('../../schemas/courses.js');

async function delete_c (id, res){
    return await schema.deleteCour(id)
}

module.exports = delete_c