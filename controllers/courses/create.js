const { json } = require('body-parser');
const schema = require('../../schemas/courses.js');

async function create (body, res) {
    
    let name = body.name_cour;
    let teacher_CourFK = body.teacher_cour;
    let category_Cour = body.category_cour;
    let desc_Cour = body.desc_cour;
    let image_Cour = body.img_cour;
    
    const data = [
        name,
        teacher_CourFK,
        category_Cour,
        desc_Cour,
        image_Cour
    ]

    schema.createCour(data)
    
}

module.exports = create