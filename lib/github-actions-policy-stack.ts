import * as cdk from 'aws-cdk-lib';
import {PolicyStatement, Effect, Role, ManagedPolicy} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class GithubActionsPolicyStack extends cdk.Stack {
    constructor(scope: Construct, id: string, role: Role, props?: cdk.StackProps) {
        super(scope, id, props);

        // Read the ENVIRONMENT variable from Github Actions Runner
        const environment= process.env.ENVIRONMENT;

        // Example fine grained policy for prod environment
        const prodPolicy = new PolicyStatement({
            actions: [
                "cloudformation:*",
                "s3:*",
                "iam:*",
                "ssm:*"
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
            sid: 'ProdPolicyGithubActions'
        })

        // If ENVIRONMENT variable is not set, add 'AdministratorAccess' policy to role
        // Needed for bootstrapping the environment of each AWS account
        if (!process.env.ENVIRONMENT) {
            role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
        }

        // if dev environment, add correct policy to role.
        if (environment === 'dev') {
            // Uses the AWS managed policy 'AdministratorAccess'
            role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
        }

        // if prod environment, add correct policy to role.
        if (environment === 'prod') {
            // Uses the custom prodPolicy set above.
            role.addToPrincipalPolicy(prodPolicy);
        }
    }
}
