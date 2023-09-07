import YAML from 'yaml';

export function parseYaml<T>(content: string): T | null {
  try {
    return YAML.parse(content);
  } catch {
    return null;
  }
}
