async function u_desconect() {
    await axios.post('/api/users/desconect').then((res) => {
        window.location.replace('/login')
    }).catch((err) => {
        console.log(err)
    })
}