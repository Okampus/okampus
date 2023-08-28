function setNativeValue(element: HTMLInputElement, value: string) {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {};
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    throw new Error('The given element does not have a value setter');
  }
}

export const triggerOnChange = (element: HTMLInputElement, value: string) => {
  setNativeValue(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
};
