function c_edit () {
    const url_path = (window.location.href).toLowerCase();
    const param = new URL(url_path);

    const id = param.pathname.replace("/cursos/info/id=", "")

    window.location.replace('/cursos/editar/id=' + id )
}