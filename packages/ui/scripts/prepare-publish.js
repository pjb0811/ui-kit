const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const publishTemplatePath = path.join(__dirname, '..', 'package.publish.json');
const backupPath = path.join(__dirname, '..', 'package.json.backup');

console.log('📦 Preparing package for publishing...\n');

try {
  // 1. 원본 백업
  const originalPackage = fs.readFileSync(packageJsonPath, 'utf8');
  fs.writeFileSync(backupPath, originalPackage);
  console.log('✓ Backed up original package.json');

  // 2. 원본과 배포용 템플릿 로드
  const packageJson = JSON.parse(originalPackage);
  const publishTemplate = JSON.parse(
    fs.readFileSync(publishTemplatePath, 'utf8'),
  );

  // 3. 병합: 원본의 dependencies 등은 유지하고, 배포 관련만 덮어쓰기
  const publishPackage = {
    ...packageJson,
    name: publishTemplate.name,
    exports: publishTemplate.exports,
    main: publishTemplate.main,
    module: publishTemplate.module,
    types: publishTemplate.types,
  };

  // 4. 배포용 package.json 작성
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(publishPackage, null, 2) + '\n',
  );

  console.log('✓ Updated package.json for publishing');
  console.log(`  - Name: ${packageJson.name} → ${publishTemplate.name}`);
  console.log('  - Exports: Updated to dist paths');
  console.log('  - Main: Updated to dist files');
  console.log('');
  console.log('🎉 Package is ready for publishing!');
} catch (error) {
  console.error('❌ Error preparing package:', error.message);
  process.exit(1);
}
