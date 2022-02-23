export default function setToHappen(fn, date) {
    return setTimeout(fn, date - Date.now())
}
