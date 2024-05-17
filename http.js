function httpGet(URL) {
    const request = new XMLHttpRequest();
    request.open("GET", URL, false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        console.log(request.responseText);
        return request.responseText;
    }
    return null;
}