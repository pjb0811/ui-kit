const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 배포용 이름으로 변경
if (packageJson.name === '@repo/ui') {
  packageJson.name = '@jbpark/ui-kit';
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );
  console.log('✅ 패키지 이름을 @jbpark/ui-kit로 변경했습니다.');
}
