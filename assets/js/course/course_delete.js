function c_delete () {
    const url_path = (window.location.href).toLowerCase();
    const param = new URL(url_path);

    const id = param.searchParams.get("id");

    axios.post("/api/delete/course", id).then(function(res) {
        document.getElementById("info-footer").append("<script> window.location.replace(/cursos/list/1)</script>");
    })
}