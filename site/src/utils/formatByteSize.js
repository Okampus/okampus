export default function formatBytes(size, precision = 2, step = 1024) {
    let numberOfSteps = Math.floor(Math.log(size) / Math.log(step))
    return 0 == size
        ? '0 octets'
        : parseFloat((size / Math.pow(step, numberOfSteps)).toFixed(Math.max(0, precision))) +
              ' ' +
              ['o', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'][numberOfSteps]
}
