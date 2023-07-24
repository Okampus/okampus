export async function validateEmail(email: string) {
  if (!email) return;

  const isValid = email
    .toLowerCase()
    .match(
      /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|.(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/
    );

  if (!isValid) throw new Error('Veuillez entrer une adresse mail valide.');
  return;
}
