async function c_delete () {
    const url_path = (window.location.href).toLowerCase();
    const param = new URL(url_path);

    const id = {id : param.pathname.replace("/cursos/info/id=", "")}

    await axios.post("/api/delete/course", id).then(function(res) {
        window.location.replace('/cursos/list/1')
    })
}