export function extractTextFromHTML (s, space) {
    var span = document.createElement('span')
    span.innerHTML = s
    if (space) {
        var children = span.querySelectorAll('*')
        for (var i = 0; i < children.length; i++) {
            if (children[i].textContent) { children[i].textContent += ' ' } else { children[i].innerText += ' ' }
        }
    }
    return [span.textContent || span.innerText].toString().replace(/ +/g, ' ')
}
