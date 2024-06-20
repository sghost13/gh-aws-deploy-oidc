import * as cdk from 'aws-cdk-lib';
import { PolicyStatement, Effect, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class GithubActionsPolicyStack extends cdk.Stack {
    constructor(scope: Construct, id: string, role: Role, props?: cdk.StackProps) {
        super(scope, id, props);

        // Base policy for CDK Deployments
        const cdkDeploymentPolicy = new PolicyStatement({
            actions: [
                'cloudformation:*',
                's3:ListBucket',
                's3:GetObject',
                's3:PutObject',
                'iam:PassRole',
                'ssm:GetParameter',
                'ssm:GetParameters',
                'ssm:DescribeParameters'
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
            sid: 'AllowCDKDeployments'
        });

        // Policy for EC2 Operations cdk uses
        const ec2OperationsPolicy = new PolicyStatement({
            actions: [
                'ec2:Describe*',
                'ec2:CreateTags',
                'ec2:DeleteTags'
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
            sid: 'AllowCDKEC2Operations'
        });

        // Policy for Lambda Operations cdk uses.
        const lambdaOperationsPolicy = new PolicyStatement({
            actions: [
                'lambda:CreateFunction',
                'lambda:DeleteFunction',
                'lambda:InvokeFunction',
                'lambda:UpdateFunctionCode',
                'lambda:UpdateFunctionConfiguration'
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
            sid: 'AllowCDKLambdaOperations'
        });

        // Attach policies to the github actions role
        role.addToPolicy(cdkDeploymentPolicy);
        role.addToPolicy(ec2OperationsPolicy);
        role.addToPolicy(lambdaOperationsPolicy);
    }
}
