# AWS + Github Actions with OIDC

This project is a TypeScript-based AWS CDK application that sets up an OpenID Connect (OIDC) provider for GitHub Actions, creates an IAM role for GitHub Actions to assume, and attaches necessary policies to the IAM role.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18)
- npm
- AWS CLI
- AWS CDK

### Installing

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd <project-directory>
```

3. Install the dependencies:

```bash
npm ci
```

## Running the tests

```bash
npm test
```

## Deployment

This project uses GitHub Actions for deployment. The workflow is defined in `.github/workflows/cdk-deploy.yml`. It is triggered manually, on push to the main branch, or on pull requests to the main branch.

## Built With

- [TypeScript](https://www.typescriptlang.org/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [GitHub Actions](https://github.com/features/actions)

## License

This project is licensed under the "MIT No Attribution" License - see the `LICENSE` file, or here: [MIT-0](https://github.com/aws/mit-0)
