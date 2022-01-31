export interface SimplifiedTiptapJSONContent {
  type?: string;
  content?: SimplifiedTiptapJSONContent[];
  attrs?: Record<string, string>;
  text?: string;
}

export function extractTextFromTiptap(node: SimplifiedTiptapJSONContent): string {
  if (node.text?.length)
    return node.text;
  if (node.type === 'image') {
    const metadata: string[] = [];
    if (node.attrs?.title)
      metadata.push(`${node.attrs.title}:`);
    if (node.attrs?.src)
      metadata.push(node.attrs.src);
    if (node.attrs?.alt)
      metadata.push(`(${node.attrs.alt})`);
    return metadata.join(' ');
  }
  if (node.content?.length)
    return node.content.map(subnode => extractTextFromTiptap(subnode)).join('');
  return '';
}

export function extractTextFromStringifiedTiptap(stringifiedTiptap: string): string {
  const parsedTiptap = JSON.parse(stringifiedTiptap) as SimplifiedTiptapJSONContent;
  return extractTextFromTiptap(parsedTiptap);
}
