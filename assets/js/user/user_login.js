async function u_login () {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const data = {email: email, password: password}

    await axios.post('/api/users/login', data).then((res) => {
        window.location.replace('/')
    }).catch((err) => {
        try{
            document.getElementById("warning").remove()
        }
        catch (e)
        {
            
        }

        document.getElementById("login-body").innerHTML += "<span id='warning' class='error-warning'>Email ou senha estão errados.</span>"
    })
}