function c_edit () {
    const url_path = (window.location.href).toLowerCase();
    const param = new URL(url_path);

    const id = param.searchParams.get("id");

    document.getElementById("info-footer").append("<script> window.location.replace(/cursos/editar/id=" + id + ")</script>");
}