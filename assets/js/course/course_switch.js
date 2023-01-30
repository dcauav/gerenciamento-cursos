async function c_switch (active) {
    const url_path = (window.location.href).toLowerCase();
    const param = new URL(url_path);

    const data = {id : param.pathname.replace("/cursos/info/id=", ""), active: active}

    await axios.post("/api/switch/course", data).then(function(res) {
        window.location.reload()
    }).catch((err) => err)
}