#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { GithubOidcProviderStack } from '../lib/github-oidc-provider-stack';
import { GithubActionsRoleStack } from '../lib/github-actions-role-stack';
import { GithubActionsPolicyStack } from '../lib/github-actions-policy-stack';

// Initialize the CDK application
const app = new App();

// Create the OIDC provider stack
// This stack sets up the OpenID Connect provider for GitHub Actions
const oidcProviderStack = new GithubOidcProviderStack(app, 'OidcProviderStack');

// Create the GitHub Actions role stack
// This stack creates an IAM role for GitHub Actions to assume
// The role assumes the OIDC provider created in the previous stack
const githubActionsRoleStack = new GithubActionsRoleStack(app, 'GithubActionsRoleStack', oidcProviderStack.oidcProvider.openIdConnectProviderArn);

// Create the GitHub Actions policy stack
// This stack attaches necessary policies to the IAM role created in the previous stack
new GithubActionsPolicyStack(app, 'GithubActionsPolicyStack', githubActionsRoleStack.role);

// Synthesize the CDK app
// This step generates the CloudFormation templates for the defined stacks
app.synth();