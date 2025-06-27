# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript CLI tool called `helm-image-updater` that updates image repositories and tags in Helm Chart `values.yaml` files and `appVersion` in `Chart.yaml` files. It's built with Node.js and uses Commander.js for CLI functionality and js-yaml for YAML parsing.

## Development Commands

- `npm run build` - Compile TypeScript to JavaScript in the `dist/` directory
- `npm run start` - Run the CLI directly from source using tsx
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes

## Architecture

### Core Structure
- **Single file architecture**: All functionality is in `src/index.ts`
- **Command-based CLI**: Uses Commander.js to define four main commands: `image`, `tag`, `repository`, and `chart`
- **Utility functions**: 
  - `fileLoader<T>()` - Loads and parses YAML files with error handling
  - `fileSaver()` - Saves data back to YAML files
  - `getImageTarget()` - Helper to find image sections in values files

### Commands
1. **image** - Updates both tag and/or repository in values.yaml
2. **tag** - Updates only the image tag in values.yaml  
3. **repository** - Updates only the image repository in values.yaml
4. **chart** - Updates appVersion in Chart.yaml files

### Environment Variables
All commands support environment variables as alternatives to CLI flags:
- `HELM_IMAGE_UPDATER_FILE` - File path
- `HELM_IMAGE_UPDATER_VERSION` - Version/tag
- `HELM_IMAGE_UPDATER_REPOSITORY` - Repository
- `HELM_IMAGE_UPDATER_CHART` - Chart name for subcharts

### TypeScript Configuration
- Target: ES2020, CommonJS modules
- Strict mode enabled
- Source in `src/`, compiled to `dist/`
- Excludes YAML files from compilation

### Testing
- Uses Jest with ts-jest preset
- Tests located in `tests/` directory
- Currently tests the core file loading/saving functionality
- Run individual tests: `npm test -- --testNamePattern="test name"`

### Code Quality
- ESLint with TypeScript and Prettier integration
- Stylistic plugin for code formatting rules
- Pre-commit hooks with Husky
- Semantic release configuration for automated releases