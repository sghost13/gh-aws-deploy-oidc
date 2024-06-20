import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OpenIdConnectProvider } from 'aws-cdk-lib/aws-iam';

export class GithubOidcProviderStack extends cdk.Stack {

    // Declare a public readonly property for the OIDC provider
    public readonly oidcProvider: OpenIdConnectProvider;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a new OpenIdConnectProvider
        // This OIDC provider allows GitHub Actions Runners to interact with AWS services
        // Set when and how the interaction takes place in the policy/role
        this.oidcProvider = new OpenIdConnectProvider(this, 'GithubOIDCProvider', {
            // The URL of the OIDC identity provider, in this case GitHub
            url: 'https://token.actions.githubusercontent.com',
            // The client IDs that are allowed to authenticate using this OIDC provide, in this case aws sts service
            clientIds: ['sts.amazonaws.com']
        });
    }
}
