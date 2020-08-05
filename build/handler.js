"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const aws_1 = require("./aws");
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
const buildCloudWatchUrl = (alarmName, region) => {
    const regionCode = aws_1.lookup({ full_name: region });
    return `https://${regionCode}.console.aws.amazon.com/cloudwatch/home?region=${regionCode}#alarmsV2:alarm/${alarmName}?`;
};
const sendMessage = (message) => {
    axios_1.default.post(slackWebhookUrl, message)
        .then((response) => {
        if (response.data === 'ok') {
            return {};
        }
        else {
            throw new Error(response.data);
        }
    });
};
const processRecord = (record) => {
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
                            "text": `${subject}`,
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
                                "text": `*Account* \n ${message.AWSAccountId}`
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
exports.event = (event, context, cb) => {
    Promise.all(event.Records.map(processRecord))
        .then(() => cb(null))
        .catch((err) => cb(err));
};
//# sourceMappingURL=handler.js.map