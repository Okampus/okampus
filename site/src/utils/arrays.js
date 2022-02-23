import { NOOP } from '@vue/shared'

export function upsert(
    arr,
    el,
    cond,
    {
        beforeInsert = NOOP,
        onInsert = NOOP,
        beforeUpdate = NOOP,
        onUpdate = NOOP,
        onAfter = NOOP,
        addOnlyNewKeys = true,
    },
) {
    const index = arr.findIndex(cond)
    if (index === -1) {
        el = beforeInsert(el, arr) ?? el
        arr.push(el)
        onInsert(el, arr)
    } else {
        el = beforeUpdate(el, arr) ?? el
        if (addOnlyNewKeys) {
            arr[index] = { ...arr[index], ...el }
        } else {
            arr[index] = el
        }
        onUpdate(el, arr)
    }
    onAfter(el, arr)
}

export function pushAndReturnIn(arr) {
    return (el) => {
        arr.push(el)
        return el
    }
}

export function pushAndReturn(arr, el) {
    arr.push(el)
    return el
}
