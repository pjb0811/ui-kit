# Changelog

이 프로젝트의 모든 주요 변경사항을 이 파일에 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 준수합니다.

## [Unreleased]

## [0.4.3] - 2026-07-19

### 추가

- 코딩 스타일 가이드 추가

### 변경

- 새 컴포넌트 생성 시 폴더명 규칙 변경
- 스토리북 스토리 생성 시 폴더명 규칙 변경

## [0.4.2] - 2026-07-12

### 변경

- 퍼블리시 체크 명령어 개선

### 제거

- Changesets 관련 설정 파일 제거

## [0.4.1] - 2026-07-05

### 추가

- Splitter: 크기 조절 가능한 패널 스플리터 추가
- Config: CSS 변수 기반 테마 토큰 오버라이드 및 다크 모드 설정 추가

### 변경

- Layout: 접이식 Sider 포함으로 변경

## [0.4.0] - 2026-07-05

### 추가

- 커밋 메시지 작성 가이드 추가
- 새 컴포넌트 생성 가이드 추가
- 새 스토리 추가 가이드 추가

## [0.3.0] - 2026-07-05

### 추가

- workflow_dispatch 이벤트 추가
- diff 시작 커밋 SHA 입력 추가

### 변경

- 모델 요청 시 GITHUB_TOKEN 대신 개인 PAT 사용

## [0.2.0] - 2026-07-05

### 추가

- 루트 CHANGELOG.md 도입
- `develop` 브랜치 통합 changelog 자동화 파이프라인 추가 (GitHub Models 기반 semver bump + changelog 작성, PR 자동 생성/머지)
- CI 워크플로우에 `develop` 브랜치 트리거 추가

### 변경

- changelog 자동화 스크립트에서 Keep a Changelog 형식 지원 추가
- 루트 package.json에 버전 필드 추가

## [0.1.0] - 2026-07-05

### 추가

- 루트 CHANGELOG.md 도입
- `develop` 브랜치 통합 changelog 자동화 파이프라인 추가 (GitHub Models 기반 semver bump + changelog 작성, PR 자동 생성/머지)
- CI 워크플로우에 `develop` 브랜치 트리거 추가
