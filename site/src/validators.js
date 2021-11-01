import { defineRule } from 'vee-validate'
import { required, min, max } from '@vee-validate/rules'

defineRule('required', required)
defineRule('min', min)

const caracType = ['caractère', 'caractères']
const tagType = ['tag', 'tags']

function getCharMessage (minLength, maxLength, type, typePlural) {
  if (minLength && maxLength) {
    return `entre ${minLength} et ${maxLength} ${maxLength > 1 ? typePlural : type}`
  } else if (minLength) {
    return `plus de ${minLength} ${minLength > 1 ? typePlural : type}`
  } else if (maxLength) {
    return `moins de ${minLength} ${minLength > 1 ? typePlural : type}`
  } else {
    return `plus de 0 ${type}`
  }
}

function checkMinMax (value, minLength, maxLength) {
  if (minLength && maxLength) {
    return min(value, { length: minLength }) && max(value, { length: maxLength })
  } else if (minLength) {
    return min(value, { length: minLength })
  } else if (maxLength) {
    return max(value, { length: maxLength })
  } else {
    return required(value)
  }
}

function checkMinMaxLength (value, minLength, maxLength) {
  if (minLength && maxLength) {
    return value.length >= minLength && value.length <= maxLength
  } else if (minLength) {
    return value.length >= minLength
  } else if (maxLength) {
    return value.length <= minLength
  } else {
    return value.length > 0
  }
}

defineRule('postType', (value) => {
  if (!required(value)) {
    return 'Le type du Post doit être sélectionné'
  }

  if (parseInt(value) >= 1 && parseInt(value) <= 4) {
    return true
  }

  return 'Le type du Post doit être 1 (Question), 2 (Suggestion), 3 (Problème), 4 (Discussion)'
})

defineRule('postTitle', (value, [minLength, maxLength]) => {
  if (!required(value)) {
    return 'Un Post doit avoir un titre'
  }

  if (checkMinMax(value, minLength, maxLength)) {
    return true
  }

  return `Un titre de Post doit faire ${getCharMessage(minLength, maxLength, ...caracType)}`
})

defineRule('postBody', (value, [minLength, maxLength]) => {
  if (checkMinMax(value, minLength, maxLength)) {
    return true
  }

  return `Un Post doit faire ${getCharMessage(minLength, maxLength, ...caracType)}`
})

defineRule('postTags', (value, [minLength, maxLength]) => {
  if (!Array.isArray(value)) {
    return "Les tags doivent être sous la forme d'une liste de chaînes de caractères"
  }

  if (checkMinMaxLength(value, minLength, maxLength)) {
    return true
  }

  return `Un Post doit avoir ${getCharMessage(minLength, maxLength, ...tagType)}`
})
