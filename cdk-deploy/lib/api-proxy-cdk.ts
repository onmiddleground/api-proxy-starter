import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_sqs as sqs } from 'aws-cdk-lib';
import { aws_sns as sns } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import * as apiGatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class ApiProxyCdk extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // new s3.Bucket(this, "api-proxy-cdk-demo-sample", {
    //   versioned: false,
    //   bucketName: "api-proxy-cdk-demo-sample",
    // });

    const apiProxyFunction = new lambda.Function(this, "apiProxy-function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("../aws_dist/"),
      handler: "lambda.handler"
    })

    // defines an API Gateway REST API resource backed by our "hello" function.
    const httpApi: apiGatewayV2.HttpApi = new apiGatewayV2.HttpApi(this, 'apiProxyApi');

    // Add an integration for the Lambda function
    const lambdaIntegration = new integrations.HttpLambdaIntegration("api-proxy-integration",apiProxyFunction);

    // Balance this with the setting in lambda.ts setGlobalPrefix setting.
    httpApi.addRoutes({
      path: '/api/{proxy+}',
      methods: [ apiGatewayV2.HttpMethod.GET ],
      integration: lambdaIntegration,
    });

    // const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // const topic = new sns.Topic(this, 'CdkWorkshopTopic');

    // topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
