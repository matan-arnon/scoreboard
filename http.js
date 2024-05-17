function httpGet(URL) {
    const request = new XMLHttpRequest();
    request.open("GET", URL, false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        return request.responseText;
    }
    return null;
}