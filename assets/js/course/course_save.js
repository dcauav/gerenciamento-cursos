async function c_save() {
    let img = document.getElementById("img_cour");
    let name = document.getElementById("name_cour").value;
    let cat = document.getElementById("category_cour").value;
    let teacher = document.getElementById("teacher_cour").value;
    let desc = document.getElementById("desc_cour").value;

    if(!img.files[0])
    {
        await axios.post('/api/save/course', {        
            name_cour: name,
            teacher_cour: teacher,
            category_cour: cat,
            desc_cour: desc,
        })
        .then(function (res) {
            const url_path = (window.location.href).toLowerCase();
            const param = new URL(url_path);
        
            const id = param.searchParams.get("id");
        
            document.getElementById("edit-footer").append("<script> window.location.replace(/cursos/info/id=" + id + ")</script>")
        })
        .catch((error) => console.log(error))
        return;
    }

    const getData = new FormData();

    getData.append("course_image", img.files[0], 'image.jpg');
    getData.append("course_name", name);

    const url = await axios.post('/api/upload/course', getData).then((res) => res).catch(function(error) {console.log(error)});

    await axios.post('/api/create/course', {        
        name_cour: name,
        teacher_cour: teacher,
        category_cour: cat,
        desc_cour: desc,
        img_cour: JSON.stringify(url.data).replaceAll('"', "")
    })
    .then()
    .catch((error) => console.log(error))
}