import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const backupPath = path.join(__dirname, '..', 'package.json.backup');

console.log('🔄 Restoring original package.json...\n');

try {
  if (fs.existsSync(backupPath)) {
    const backup = fs.readFileSync(backupPath, 'utf8');
    fs.writeFileSync(packageJsonPath, backup);
    fs.unlinkSync(backupPath);
    console.log('✓ Restored original package.json');
    console.log('✓ Removed backup file');
    console.log('');
    console.log('🎉 Package restored to development state!');
  } else {
    console.warn('⚠️  No backup found, skipping restore');
    console.log(
      '   This might be normal if publish failed before backup was created.',
    );
  }
} catch (error) {
  console.error('❌ Error restoring package:', error.message);
  process.exit(1);
}
