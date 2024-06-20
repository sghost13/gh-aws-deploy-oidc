# AWS + Github Actions with OIDC

This project is a TypeScript-based AWS CDK application that sets up an OpenID Connect (OIDC) provider for Github Actions, creates an IAM role for Github Actions to assume, and attaches necessary policies to the IAM role.

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

This project uses Github Actions for deployment. The workflow is defined in `.github/workflows/cdk-deploy.yml`. Before the workflow will work it needs to be bootstrapped from your machine using `cdk deploy --all`, so that it exists in your aws account. After that it should only be ran by your workflow. You will need to configure the following items for it to function correctly:

1. **Github Environment Secrets**: You will need to set the following secrets in your Github repository's settings:

    - `AWS_ACCOUNT_ID`: The AWS account ID where the CDK application will be deployed.
    - `AWS_REGION`: The AWS region where the CDK application will be deployed.

2. **Workflow triggers**: Any workflow triggers you may need. ie:
   - `workflow_dispatch`
   - `push`
   - `pull_request`.

3. **Add itself to the CDK application**: You will need to add the CDK application to itself. This is done by running `cdk deploy --all` from your local machine. This will create the necessary resources in your AWS account so that it can then be run from that Github Actions Workflow.

4. **Add this repository to the github-actions-role-stack.ts**: You will need to add the repository to the `github-actions-role-stack.ts` file. This is done by adding the repository name to the `allowedRepositories` array. This is to ensure that only the repositories you want to have access to the role can assume it, and is needs to be able to assume it so it itself can run. The template is:`'repo:<USER/ORG_NAME>/<REPO>:environment:<GITHUB_ENV_NAME>'`

## CDK Deployment Workflow Setup

The CDK deployment workflow is defined in the `.github/workflows/cdk-deploy.yml` file. This workflow is responsible for deploying your AWS CDK application using GitHub Actions. Here's a brief explanation of the setup:

1. **Workflow Triggers**: The workflow is triggered manually (`workflow_dispatch`), on push to the main branch, or on pull requests to the main branch.

2. **Permissions**: The workflow requires `id-token: write` permission for requesting the JWT and `contents: read` permission for actions/checkout.

3. **Jobs**: The workflow defines a `deploy` job that runs on the latest Ubuntu runner. This job is associated with the `dev` environment.

4. **Steps**: The `deploy` job consists of several steps:

    - **Checkout Repository**: This step checks out your repository using the `actions/checkout@v4` action.

    - **Setup Node.js**: This step sets up Node.js using the `actions/setup-node@v4` action. The Node.js version used is 18.

    - **Cache Node.js dependencies**: This step caches Node.js dependencies to speed up future workflow runs. It uses the `actions/cache@v4` action.

    - **Install CDK Dependencies**: This step installs the CDK dependencies if they are not found in the cache. It runs `npm ci` in the root directory of your project.

    - **Configure AWS Creds**: This step configures AWS credentials using the `aws-actions/configure-aws-credentials@v4` action. It assumes a role with the ARN `arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GithubActions` and sets the AWS region to the value of the `AWS_REGION` secret.

    - **Deploy CDK**: This step deploys your CDK application using the `npx cdk deploy --all --require-approval never` command.

Please ensure that you have the necessary secrets (`AWS_ACCOUNT_ID` and `AWS_REGION`) set in your GitHub repository's secrets settings.

## Built With

- [TypeScript](https://www.typescriptlang.org/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [GitHub Actions](https://github.com/features/actions)

## License

This project is licensed under the "MIT No Attribution" License - see the `LICENSE` file, or here: [MIT-0](https://github.com/aws/mit-0)
