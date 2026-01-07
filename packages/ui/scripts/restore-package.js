const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 로컬 개발용 이름으로 복원
if (packageJson.name === '@jbpark/ui-kit') {
  packageJson.name = '@repo/ui';
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );
  console.log('✅ 패키지 이름을 @repo/ui로 복원했습니다.');
}
