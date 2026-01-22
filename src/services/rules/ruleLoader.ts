import fs from 'fs';
import path from 'path';
import { Language } from '../../domain/enums';

export function loadSystemRules(language: Language): string {
  const filePath = path.join(
    process.cwd(),
    'docs',
    'rules',
    language,
    'system_rules.md'
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Rules not found for language: ${language}`);
  }

  return fs.readFileSync(filePath, 'utf-8');
}
