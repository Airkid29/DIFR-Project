# Contributing to DFIR-Lab

Thank you for your interest in contributing to DFIR-Lab. Contributions are welcome from developers, security researchers, and product collaborators.

## How to Contribute

1. Fork the repository and create a branch named for your work, e.g. `feature/clear-audit-report` or `fix/security-hardening`.
2. Make your changes in a clean branch.
3. Run the project locally and verify your changes.
4. Open a pull request describing the intent of the change and any testing performed.

## Development Setup

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

## Coding Guidelines

- Keep PRs focused and explain the business impact.
- Write clear commit messages and use descriptive branch names.
- Follow the existing code style and naming conventions.
- Add tests for bug fixes and new functionality when possible.
- Avoid committing secrets, credentials, or API keys.

## Reporting Issues

Please open issues for bugs, feature requests, or security concerns. Include a concise description, steps to reproduce, and the expected behavior.
