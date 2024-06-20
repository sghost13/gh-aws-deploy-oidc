import * as cdk from 'aws-cdk-lib';
import {PolicyStatement, Effect, Role, ManagedPolicy} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class GithubActionsPolicyStack extends cdk.Stack {
    constructor(scope: Construct, id: string, role: Role, props?: cdk.StackProps) {
        super(scope, id, props);

        // Add managed policies to the Github Actions role
        role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

        // Base policy for CDK Deployments
        // For fine-tuned permissions, see the example below
        // const cdkDeploymentPolicy = new PolicyStatement({
        //     actions: [
        //         // CloudFormation actions
        //         "cloudformation:*",
        //
        //         // S3 actions
        //         "s3:ListBucket",
        //         "s3:GetObject",
        //         "s3:PutObject",
        //         "s3:DeleteObject",
        //
        //         // IAM actions
        //         "iam:PassRole",
        //         "iam:CreateRole",
        //         "iam:DeleteRole",
        //         "iam:AttachRolePolicy",
        //         "iam:DetachRolePolicy",
        //         "iam:PutRolePolicy",
        //         "iam:DeleteRolePolicy",
        //         "iam:GetRole",
        //         "iam:ListRoles",
        //
        //         // SSM actions
        //         "ssm:GetParameter",
        //         "ssm:GetParameters",
        //         "ssm:DescribeParameters",
        //
        //         // EC2 actions
        //         "ec2:DescribeInstances",
        //         "ec2:DescribeSecurityGroups",
        //         "ec2:DescribeVpcs",
        //         "ec2:DescribeSubnets",
        //         "ec2:DescribeRouteTables",
        //         "ec2:CreateTags",
        //         "ec2:DeleteTags",
        //
        //         // Lambda actions
        //         "lambda:CreateFunction",
        //         "lambda:DeleteFunction",
        //         "lambda:InvokeFunction",
        //         "lambda:UpdateFunctionCode",
        //         "lambda:UpdateFunctionConfiguration",
        //         "lambda:GetFunctionConfiguration",
        //         "lambda:ListFunctions",
        //
        //         // Logs actions (for Lambda)
        //         "logs:CreateLogGroup",
        //         "logs:CreateLogStream",
        //         "logs:PutLogEvents",
        //         "logs:DescribeLogGroups",
        //         "logs:DescribeLogStreams"
        //     ],
        //     resources: ['*'],
        //     effect: Effect.ALLOW,
        //     sid: 'AllowCDKDeployments'
        // });
        // // Attach the above policies to the Github actions role
        // role.addToPrincipalPolicy(cdkDeploymentPolicy);
    }
}
