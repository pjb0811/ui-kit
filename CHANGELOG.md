# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Added

- Splitter: add resizable panel splitter
- Config: add CSS variable-based theme token overrides and dark mode configuration

### Changed

- Layout: change to include collapsible Sider

## [0.4.0] - 2026-07-05

### Added

- Add commit message writing guide
- Add new component creation guide
- Add new story creation guide

## [0.3.0] - 2026-07-05

### Added

- Add workflow_dispatch event
- Add diff start commit SHA input

### Changed

- Use personal PAT instead of GITHUB_TOKEN for model requests

## [0.2.0] - 2026-07-05

### Added

- Introduce root CHANGELOG.md
- Add `develop` branch integrated changelog automation pipeline (GitHub Models-based semver bump + changelog authoring, automatic PR creation/merge)
- Add `develop` branch trigger to CI workflow

### Changed

- Add Keep a Changelog format support to changelog automation script
- Add version field to root package.json

## [0.1.0] - 2026-07-05

### Added

- Introduce root CHANGELOG.md
- Add `develop` branch integrated changelog automation pipeline (GitHub Models-based semver bump + changelog authoring, automatic PR creation/merge)
- Add `develop` branch trigger to CI workflow
