import { isEmpty } from 'lodash'

export function onItems(func, args) {
    console.log(args)
    if (!isEmpty(args)) {
        return ({ data: { items, ...pageInfo } }) => func({ ...args, items, pageInfo })
    }
    return ({ data: { items, ...pageInfo } }) => func(items, pageInfo)
}

export function onData(func, args) {
    if (!isEmpty(args)) {
        return ({ data }) => func({ ...args, data })
    }
    return ({ data }) => func(data)
}

export function sameById(item1, item2, idKey) {
    return item1[idKey] === item2[idKey]
}

export function sameByIdFunc(item1, idKey) {
    return (item2) => sameById(item1, item2, idKey)
}
