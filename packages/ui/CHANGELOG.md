# @repo/ui

이 프로젝트의 모든 주요 변경사항을 이 파일에 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 준수합니다.

## [Unreleased]

## [2.5.0] - 2026-04-05

### 추가

- `ConfigProvider` export 추가 (중첩 테마 토큰 오버라이드 및 다크 모드 설정 적용)

### 변경

- 버튼, 스위치, 공용 테마 스타일이 provider 기반 테마 값을 반영하도록 개선
- 토큰 오버라이드/다크 모드/중첩 provider 사용 예시를 다루는 Storybook 스토리 추가

## [2.4.0] - 2026-03-22

### 추가

- `Radio.Group`에 `optionType`(`'default' | 'button'`), `buttonStyle`, `size`, `disabled` prop 추가 (버튼 스타일 라디오 렌더링)
- `Button`에 `type`(`'primary' | 'default' | 'dashed' | 'text' | 'link'`), `shape`(`'default' | 'circle' | 'round'`) prop 추가
- `Switch`에 `size`(`'small' | 'medium'`) prop 추가
- `Switch`에 `checkedChildren`, `unCheckedChildren` prop 추가 (애니메이션 라벨 렌더링)
- core `Switch` 프리미티브에 `children` 슬롯 노출

### 변경

- `Radio.Group` 기본 방향을 `'vertical'`에서 `'horizontal'`로 변경
- `Button`이 `variant`를 명시하지 않으면 내부 `typeToVariant` 매핑으로 `type`에서 결정하도록 변경
- `OptionValue` 타입을 `Group` 모듈로 이동, `Radio`/`Checkbox` 양쪽에서 재노출
- 아이콘 전용 `Button` 사이즈 처리에 `iconClasses` 기반 SVG 크기 유틸리티 반영

## [2.3.4] - 2026-02-10

### 변경

- 빌드 파이프라인 정리: tsdown 설정으로 전환, CSS 출력 이름 조정, TS 빌드 설정 업데이트

## [2.3.3] - 2026-02-06

### 수정

- field 컴포넌트의 core export 구조 분해 오류 수정

## [2.3.2] - 2026-02-05

### 수정

- core 프리미티브에서 네임스페이스 import와 직접 import 방식 모두 지원하도록 수정

## [2.3.1] - 2026-02-05

### 추가

- 패키지 export를 통해 core 프리미티브 노출

## [2.3.0] - 2026-02-05

### 추가

- 신규 컴포넌트 추가

### 변경

- 컴포넌트 API 개선

## [2.2.2] - 2026-02-03

### 변경

- 버전 정리 (기능 변경 없음)

## [2.2.1] - 2026-02-03

### 수정

- Progress 값을 0~100 범위로 clamp 처리해 렌더링 안정화

## [2.2.0] - 2026-02-03

### 추가

- Radio, Select, ColorPicker 신규 컴포넌트 추가

### 변경

- Popover, Progress, Switch, Textarea 스타일 및 옵션 개선

## [2.1.0] - 2026-01-28

### 추가

- Popover placement 옵션 추가

### 변경

- 컴포넌트 아키텍처를 centralized core export 구조로 리팩터링
- Card, Drawer의 조건부 렌더링 패턴 개선
- Button, Checkbox, Input, Progress, Skeleton, Switch가 새로운 core import 구조를 사용하도록 변경

## [2.0.1] - 2026-01-26

### 변경

- 버전 정리

## [2.0.0] - 2026-01-24

### 변경

- **(주요 변경)** `Button` variant 및 color 처리 방식 개선

## [1.1.7] - 2026-01-24

### 변경

- Marquees 너비 처리 및 반응형 개선

## [1.1.6] - 2026-01-18

### 추가

- `Input` 컴포넌트 export 추가

## [1.1.5] - 2026-01-18

### 제거

- tsdown 설정에서 미사용 외부 의존성 제거

## [1.1.4] - 2026-01-18

### 변경

- README 파일 언어 링크 업데이트

## [1.1.3] - 2026-01-17

### 변경

- CI를 main 브랜치로만 제한

## [1.1.2] - 2026-01-17

### 변경

- publish 워크플로우 및 스크립트 업데이트

## [1.1.1] - 2026-01-17

### 변경

- 버전 관리용 changeset 정리

## [1.1.0] - 2026-01-17

### 추가

- `Card`, `Label` 컴포넌트 추가

### 변경

- `Button`, `Checkbox` 개선

## [1.0.1] - 2026-01-10

### 변경

- 빌드 설정 업데이트, 배포 스크립트 에러 처리 개선
- `.gitignore` 규칙 수정
