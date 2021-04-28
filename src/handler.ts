import axios from 'axios';
import {Callback, Context, SNSEvent} from "aws-lambda";
import {SNSEventRecord} from "aws-lambda/trigger/sns";
import {lookup} from './aws';

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';

const buildCloudWatchUrl = (alarmName: string, regionName: string) => {
    const region = lookup({full_name: regionName});
    return `https://${region?.code}.console.aws.amazon.com/cloudwatch/home?region=${region?.code}#alarmsV2:alarm/${alarmName}?`
}

const sendMessage = (message: any) => {

    axios.post(slackWebhookUrl, message)
        .then((response) => {
            if (response.data === 'ok') {
                return {};
            } else {
                throw new Error(response.data);
            }
        });
};

const processRecord = (record: SNSEventRecord) => {
    const subject = record.Sns.Subject;
    const message = JSON.parse(record.Sns.Message);
    return sendMessage({
        "attachments": [
            {
                "color": "#CA0B00",
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": `${JSON.stringify(subject)}`,
                            "emoji": true
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "plain_text",
                            "text": message.NewStateReason
                        }
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": `*Time* \n ${message.StateChangeTime}`
                            },
                            {
                                "type": "mrkdwn",
                                "text": `*Alarm* \n ${message.AlarmName}`
                            },
                            {
                                "type": "mrkdwn",
                                "text": `*Service* \n ${process.env.DISPLAY_NAME} (${process.env.STAGE})`
                            },
                            // {
                            //     "type": "mrkdwn",
                            //     "text": `*Origin* \n ${message.AWSAccountId}`
                            // },
                            {
                                "type": "mrkdwn",
                                "text": `*Account ID* \n ${message.AWSAccountId}`
                            },
                            {
                                "type": "mrkdwn",
                                "text": `*Region* \n ${message.Region}`
                            }
                        ]
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "View alarm",
                                    "emoji": true
                                },
                                "url": buildCloudWatchUrl(message.AlarmName, message.Region)
                            }
                        ]
                    }
                ]
            }
        ]
    });
};

/*
example event:
{
  "Records": [{
     "EventSource": "aws:sns",
     "EventVersion": "1.0",
     "EventSubscriptionArn": "arn:aws:sns:us-east-1:XXX:cw-to-slack-Topic-1B8S548158492:a0e76b10-796e-471d-82d3-0510fc89ad93",
     "Sns": {
        "Type": "Notification",
        "MessageId": "[...]",
        "TopicArn": "arn:aws:sns:us-east-1:XXX:cw-to-slack-Topic-1B8S548158492",
        "Subject": "ALARM: \"cw-to-slack-Alarm-9THDKWBS1876\" in US East (N. Virginia)",
        "Message": "{\"AlarmName\":\"cw-to-slack-Alarm-9THDKWBS1876\",\"AlarmDescription\":null,\"AWSAccountId\":\"XXX\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Threshold Crossed: 1 datapoint [3.22 (29/10/17 13:20:00)] was greater than the threshold (1.0).\",\"StateChangeTime\":\"2017-10-30T13:20:35.831+0000\",\"Region\":\"US East (N. Virginia)\",\"OldStateValue\":\"INSUFFICIENT_DATA\",\"Trigger\":{\"MetricName\":\"EstimatedCharges\",\"Namespace\":\"AWS/Billing\",\"StatisticType\":\"Statistic\",\"Statistic\":\"MAXIMUM\",\"Unit\":null,\"Dimensions\":[{\"name\":\"Currency\",\"value\":\"USD\"}],\"Period\":86400,\"EvaluationPeriods\":1,\"ComparisonOperator\":\"GreaterThanThreshold\",\"Threshold\":1.0,\"TreatMissingData\":\"\",\"EvaluateLowSampleCountPercentile\":\"\"}}",
        "Timestamp": "2017-10-30T13:20:35.855Z",
        "SignatureVersion": "1",
        "Signature": "[...]",
        "SigningCertUrl": "[...]",
        "UnsubscribeUrl": "[...]",
        "MessageAttributes": {}
     }
  }]
}
*/
exports.event = (event: SNSEvent, context: Context, cb: Callback) => {
    Promise.all(event.Records.map(processRecord))
        .then(() => cb(null))
        .catch((err) => cb(err));
};