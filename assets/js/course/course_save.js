async function c_save() {
    let img = document.getElementById("img_cour");
    let name = document.getElementById("name_cour").value;
    let cat = document.getElementById("category_cour").value;
    let teacher = document.getElementById("teacher_cour").value;
    let desc = document.getElementById("desc_cour").value;

    const url_path = (window.location.href).toLowerCase();
    const param = new URL(url_path);

    const id = param.pathname.replace("/cursos/editar/id=", "")
    const getData = new FormData();
    getData.append("course_image", img.files[0], 'image.jpg');
    getData.append("course_name", name);
    getData.append("course_update", true)
    getData.append("course_id", id)
    
    const url = await axios.post('/api/upload/course', getData).then((res) => res).catch(function(error) {console.log(error)});

    await axios.post('/api/save/course', {        
        name_cour: name,
        teacher_cour: teacher,
        category_cour: cat,
        desc_cour: desc,
        img_cour: JSON.stringify(url.data).replaceAll('"', ""),
        id_cour: id
    })
    .then()
    .catch((error) => console.log(error))
}