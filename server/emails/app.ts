import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as aws from 'aws-sdk';

const ses = new aws.SES({
    region: process.env.PW_AWS_ACCESS_REGION,
    accessKeyId: process.env.PW_AWS_ACCESS_KEY,
    secretAccessKey: process.env.PW_AWS_ACCESS_SECRET,
});

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const headers = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
};

export const postEmail = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const fail = validateSendEmailEvent(event);
        if (fail) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: fail,
                }),
            };
        } else {
            const data = JSON.parse(event.body!);
            await sendSESEmail(data.address, data.message);
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({
                    address: data.address,
                    message: data.message,
                }),
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: 'Unknown error',
            }),
        };
    }
};

const validateSendEmailEvent = (event: APIGatewayProxyEvent): string | undefined => {
    if (!event.body) return 'Request body required';
    const data = JSON.parse(event.body);
    if (!data.hasOwnProperty('address')) return 'Address required';
    if (!data.hasOwnProperty('address')) return 'Message required';
    return;
};

const sendSESEmail = async (address: string, message: string): Promise<any> => {
    return ses
        .sendEmail({
            Source: 'noreply@dowstack.com',
            Destination: {
                ToAddresses: ['griffin@griffindow.com'],
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: message,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `New contact from ${address}`,
                },
            },
        })
        .promise();
};
