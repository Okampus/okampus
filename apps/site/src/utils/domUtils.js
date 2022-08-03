export const highlightElement = (el) => {
    el.classList.add('highlight-active')
    el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    })
    el.addEventListener(
        'animationend',
        () => {
            el.classList.remove('highlight-active')
        },
        { once: true },
    )
}
