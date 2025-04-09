import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import {
  //  PolicyStatement,
  //  Effect,
  Role,
  ManagedPolicy,
  FederatedPrincipal,
  OpenIdConnectProvider,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * Stack that combines GitHub OIDC provider, IAM role, and policy attachment
 * for GitHub Actions workflows.
 */
export class GithubActionsOidc extends Stack {
  // Public properties for the OIDC provider and role
  public readonly githubOidcProvider: OpenIdConnectProvider;
  public readonly role: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a new OpenIdConnectProvider
    // This OIDC provider allows Github Actions Runners to interact with AWS services
    // Set when and how the interaction takes place in the policy/role
    this.githubOidcProvider = new OpenIdConnectProvider(
      this,
      'GithubOIDCProvider',
      {
        // The URL of the OIDC identity provider, in this case Github
        url: 'https://token.actions.githubusercontent.com',
        // The client IDs that are allowed to authenticate using this OIDC provide, in this case aws sts service
        clientIds: ['sts.amazonaws.com'],
      }
    );

    // Create a new IAM role for Github Actions to use
    this.role = new Role(this, 'GithubActionsRole', {
      // Specify the principal that can assume this role
      // Use the OIDC provider ARN for Github Actions
      assumedBy: new FederatedPrincipal(
        this.githubOidcProvider.openIdConnectProviderArn,
        {
          StringLike: {
            // Conditions for the OIDC provider
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            'token.actions.githubusercontent.com:sub': [
              // Sets the Username/Organization, Repo, that AWS will allow to be deployed from.
              // Only the specific repo will be allowed, any Github environment, using temporary keys with OIDC.
              // 'repo:<USER/ORG_NAME>/<REPO>:environment:*'
              'repo:sghost13/gh-aws-deploy-oidc:environment:*',
              'repo:sghost13/mdbook-test:environment:*',
              'repo:sghost13/test-foundation:environment:*',
            ],
          },
        },
        // The role action being assumed, allows a web identity(Github Runners) to assume the specified role.
        'sts:AssumeRoleWithWebIdentity'
      ),
      // Description for the role
      description: 'Role for Github Actions to deploy using CDK',
      // Custom name for the role
      roleName: 'GithubActions',
      // Maximum duration for the role session
      maxSessionDuration: Duration.hours(1),
    });

    // Read the ENVIRONMENT variable from Github Actions Runner
    const environment = process.env.ENVIRONMENT;

    // // Example: fine-grained policy for prod environment
    // const prodPolicy = new PolicyStatement({
    //     actions: [
    //         "cloudformation:*",
    //         "s3:*",
    //         "iam:*",
    //         "ssm:*"
    //     ],
    //     resources: ['*'],
    //     effect: Effect.ALLOW,
    //     sid: 'ProdPolicyGithubActions'
    // });

    // If ENVIRONMENT variable is not set, add 'AdministratorAccess' policy to role
    // Needed for bootstrapping the environment of each AWS account
    if (!process.env.ENVIRONMENT) {
      this.role.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
      );
    }

    // if dev environment, add correct policy to role.
    if (environment === 'dev') {
      // Uses the AWS managed policy 'AdministratorAccess'
      this.role.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
      );
    }

    // // Example: if prod environment, used fine-grained prod policy
    // if (environment === 'prod') {
    //     // Uses the custom prodPolicy set above.
    //     this.role.addToPrincipalPolicy(prodPolicy);
    // }
  }
}
