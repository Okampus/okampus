export function useFormPersist<T>(key: string) {
  const stepKey = `${key}-step`;
  const valuesKey = `${key}-values`;

  const getFormStep = () => {
    const persisted = localStorage.getItem(stepKey);
    return persisted ? JSON.parse(persisted) : 0;
  };

  const setFormStep = (step: number) => {
    localStorage.setItem(stepKey, JSON.stringify(step));
  };

  const getFormValues = () => {
    const persisted = localStorage.getItem(valuesKey);
    return persisted ? JSON.parse(persisted) : {};
  };

  const setFormValues = (values: T) => {
    localStorage.setItem(valuesKey, JSON.stringify(values));
  };

  return { getFormStep, getFormValues, setFormStep, setFormValues };
}
