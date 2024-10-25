# Contributing to DataAnalyzer

Thank you for your interest in contributing to DataAnalyzer! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/data-analyzer.git
cd data-analyzer
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-owner/data-analyzer.git
```

4. Create a branch:
```bash
git checkout -b feature/your-feature-name
```

## 💻 Development Process

1. Write your code following our [coding standards](#coding-standards)
2. Add tests for new functionality
3. Update documentation as needed
4. Run tests and linting:
```bash
npm run test
npm run lint
```

5. Commit your changes:
```bash
git add .
git commit -m "feat: add amazing feature"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

## 🔄 Pull Request Guidelines

1. Update your fork:
```bash
git fetch upstream
git rebase upstream/main
```

2. Push your changes:
```bash
git push origin feature/your-feature-name
```

3. Create a Pull Request with:
   - Clear title and description
   - Link to related issues
   - Screenshots/GIFs for UI changes
   - Updated documentation

4. Address review feedback

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for new code
- Follow ESLint configuration
- Use functional components and hooks
- Maintain 100% type safety

### React Components

```typescript
// Good
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Implementation
};

// Bad
function MyComponent(props) {
  // Implementation
}
```

### File Organization

```
components/
├── ComponentName/
│   ├── index.tsx
│   ├── ComponentName.test.tsx
│   └── styles.module.css
```

## ✅ Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Use React Testing Library for component tests
- Use Jest for unit tests

Example:
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments to functions
- Update API documentation
- Include usage examples

## 🐛 Issue Reporting

### Bug Reports

Include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/videos if applicable

### Feature Requests

Include:
- Clear use case
- Expected behavior
- Proposed implementation
- Examples of similar features

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.