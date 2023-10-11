content="export type IntlContext = "
for file in $(find apps/site/public/locales/fr-FR -name '*.json'); do
  content="$content '$(basename $file .json)' |"
done

echo $content | sed 's/..$/;/' >apps/site/types/intl-context.type.ts
