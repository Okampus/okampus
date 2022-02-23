export function onItems(func) {
    return ({ data: { items, ...pageInfo } }) => func(items, pageInfo)
}

export function onData(func) {
    return ({ data }) => func(data)
}
