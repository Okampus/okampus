export const ITEMS_PER_PAGE = 30

export function onErr(err) {
    console.log(err)
    // return Promise.reject(err)
}

export function onSuccess(commit, mutation) {
    return (data) => {
        commit(mutation, data)
        return Promise.resolve(data)
    }
}

export function settleQuery({ commit, mutation }, promise) {
    console.log('settleQuery', 'vote')
    if (typeof mutation === 'string') {
        return promise.then(onSuccess(commit, mutation), onErr)
    } else {
        return promise.then((res) => {
            mutation(res)
            return Promise.resolve()
        }, onErr)
    }
}
