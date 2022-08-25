// Create some re-useable definitions because
// many input types are identical in how
// we want to style them.
const textClassification = {
    label: 'text-1 ml-2.5 text-base formkit-invalid:text-red-500',
    inner: 'border border-transparent formkit-invalid:ouline-red-500',
    input: 'block w-full input',
}
const boxClassification = {
    fieldset: 'rounded-md px-3 pb-2 bg-3 shadow mb-2',
    legend: 'text-1 text-base formkit-invalid:text-red-500',
    wrapper: 'flex cursor-pointer',
    input: 'form-check-input appearance-none h-5 w-5 border border-gray-400 rounded-sm bg-white checked:bg-blue-600 focus:outline-none focus:ring-0 transition duration-200 cursor-pointer',
    label: 'text-1 ml-2.5 text-base formkit-invalid:text-red-500',
    options: 'pt-4',
    help: 'mb-2',
}
const buttonClassification = {
    wrapper: 'mb-1',
    input: 'button-blue',
}

// export our definitions using our above
// templates and declare one-offs and
// overrides as needed.
export default {
    // the global key will apply to all inputs
    global: {
        outer: 'mt-8 formkit-disabled:opacity-50',
        help: 'text-xs text-gray-500 mb-2 mt-1',
        messages: 'list-none p-0 mt-1 mb-0',
        message: 'text-red-500 mb-3 text-xs',
    },
    button: buttonClassification,
    color: {
        input: 'w-16 h-8 appearance-none cursor-pointer border border-gray-300 rounded-md mb-2 p-1',
    },
    date: textClassification,
    'datetime-local': textClassification,
    checkbox: boxClassification,
    email: textClassification,
    file: {
        inner: 'cursor-pointer',
        input: 'text-gray-600 text-sm mb-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600',
        noFiles: 'block text-gray-800 text-sm mb-1',
        fileItem: 'block flex text-gray-800 text-sm mb-1',
        removeFiles: 'ml-auto text-blue-500 text-sm',
    },
    month: textClassification,
    number: textClassification,
    password: textClassification,
    radio: {
        ...boxClassification,
        input: boxClassification.input.replace('rounded-sm', 'rounded-full'),
    },
    range: {
        input: 'form-range appearance-none w-full h-2 p-0 bg-gray-200 rounded-full focus:outline-none focus:ring-0 focus:shadow-none',
    },
    search: textClassification,
    select: { ...textClassification, input: 'block w-full raised select' },
    submit: buttonClassification,
    tel: textClassification,
    text: textClassification,
    textarea: {
        ...textClassification,
        input: 'block w-full input',
    },
    time: textClassification,
    url: textClassification,
    week: textClassification,
}
