const schema = require('../../schemas/courses.js');

async function save (body, res){

    let name = body.name_cour;
    let teacher_CourFK = body.teacher_cour;
    let category_Cour = body.category_cour;
    let desc_Cour = body.desc_cour;
    let image_Cour = body.img_cour;
    let id_Cour = body.id_cour;
    
    const data = [
        name,
        teacher_CourFK,
        category_Cour,
        desc_Cour,
        image_Cour,
        id_Cour
    ]
    
    return await schema.saveCour(data);
}

module.exports = save