function c_search () {
    const search = document.getElementById("search-input").value

    window.location.replace("/search=" + search)
}