# AWS + Github Actions with OIDC

This project is a TypeScript-based AWS CDK application that sets up an OpenID Connect (OIDC) provider for Github Actions, creates an IAM role for Github Actions to assume, and attaches necessary policies to the IAM role. This allows for more open permissions for dev deployments, as well as fine-grained for prod if you need it. It follows the recommendations by both AWS and Github for deployment permissions, while automating the process. See Links below for further information.
- [Use IAM roles to connect GitHub Actions to actions in AWS - AWS Docs](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/)
- [Configuring OpenID Connect in Amazon Web Services - Github Docs](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
## Getting Started

These instructions will get you a copy of this project up and running in your own repository.

### Prerequisites

- Create a repo for this project.
- Setup Github environments and secrets in the repo you just created. Use SECRETS, not variables.
- Add repositories you want to grant deployment permissions to the `github-actions-role-stack.ts` file.
- Bootstrap the project with cdk deploy --all.
- Configure the actions workflow to suit your needs. 
- Add new projects to the `github-actions-role-stack.ts` file as needed.

### Setup Github Environments and Secrets

1. Create an environment in your Github repository settings.
   - Name the environment based on where it is deploying. (ie prod, dev, staging, etc based on your needs.) 
   - The default is the main branch is prod.
2. Create secret variables in each Github environment you are deploying too. USE SECRETS, NOT variables.
    - `AWS_ACCOUNT_ID`: The AWS account ID where the CDK application will be deployed. (Your AWS account number)
    - `AWS_REGION`: The AWS region where the CDK application will be deployed. (us-east-1)
    - `ENVIRONMENT`: The name of the deployment environment. (ie prod, dev, staging, etc)

### Add Repositories you want to grant deployment permissions to

1. Open the `github-actions-role-stack.ts` file.
2. Add this codes repository that you created to the `allowedRepositories` array in the `github-actions-role-stack.ts` file.
   - Use this template: `'repo:USER_OR_ORG_NAME/THIS_PROJECTS_REPO:*'`
3. Add any repos you want to allow to be deployed via Github actions, new line for each repo to the `allowedRepositories` array in the `github-actions-role-stack.ts` file.
   - Use this template: `repo:USER_OR_ORG_NAME/REPO:*'`

### Bootstrap the project with CDK
1. From your local machine, bootstrap the project.
   - It needs to exist in AWS so itself has a role to assume from Github actions. Chicken/Egg problem.
   - Run `cdk deploy --all` from the root of the project.

### Configure the Actions Workflow
1. Configure the Actions workflow file to suit your needs. 
   - The workflow is defined in the `.github/workflows/cdk-deploy.yml` file.
   - You can change the triggers, permissions, jobs, and steps as needed.

### Add new projects to the `github-actions-role-stack.ts` file as needed
1. Add new Repos and projects to the `github-actions-role-stack.ts` file as needed.
   - Use the same template as above to add new repositories to the `allowedRepositories` array.
   - This project will automatically deploy by Github actions, giving the new repo permissions to deploy.
   - This project and the new project will use Temporary Keys, and OIDC between Github and AWS to deploy.

## Built With

- [TypeScript](https://www.typescriptlang.org/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [GitHub Actions](https://github.com/features/actions)

## License

This project is licensed under the "MIT No Attribution" License - see the `LICENSE` file, or here: [MIT-0](https://github.com/aws/mit-0)
