#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { GithubActionsOidc } from "../lib/github-actions-oidc";

const app = new App();

// Create the GitHub Actions OIDC stack (provider, role, and policies)
const githubActionsOidc = new GithubActionsOidc(app, "GithubActionsOidc");

app.synth();
