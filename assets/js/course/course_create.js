async function c_create() {
    let img = document.getElementById("img_cour");
    let name = document.getElementById("name_cour").value;
    let cat = document.getElementById("category_cour").value;
    let teacher = document.getElementById("teacher_cour").value;
    let desc = document.getElementById("desc_cour").value;

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
    .then((res) => console.log(res))
    .catch((error) => console.log(error))
}