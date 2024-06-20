import * as cdk from 'aws-cdk-lib';
import { Role, FederatedPrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class GithubActionsRoleStack extends cdk.Stack {

    // Declare a public readonly property for the IAM role
    public readonly role: Role;

    constructor(scope: Construct, id: string, oidcProviderArn: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a new IAM role for GitHub Actions to use
        this.role = new Role(this, 'GitHubActionsRole', {
            // Specify the principal that can assume this role
            // Use the OIDC provider ARN for GitHub Actions
            assumedBy: new FederatedPrincipal(oidcProviderArn, {
                    StringEquals: {
                        // Conditions for the OIDC provider
                        'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
                        'token.actions.githubusercontent.com:sub': [
                            // Sets the Username/Organization, Repo, and GitHub environments that AWS will allow to be deployed from.
                            // Only the specific repo and environment will be allowed, using temporary keys with OIDC.
                            // CASE SENSITIVE!
                            // 'repo:<USER/ORG_NAME>/<REPO>:environment:<GITHUB_ENV_NAME>'
                            'repo:sghost13/gh-aws-deploy-oidc:environment:dev'
                        ]
                    },
                },
                // The role action being assumed, allows a web identity(GitHub Runners) to assume the specified role.
                'sts:AssumeRoleWithWebIdentity'
            ),
            // Description for the role
            description: 'Role for Github Actions to deploy using CDK',
            // Custom name for the role
            roleName: 'GitHubActions',
            // Maximum duration for the role session
            maxSessionDuration: cdk.Duration.hours(1),
        });
    }
}