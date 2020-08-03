"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
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
        text: subject,
        channel: process.env.SLACK_CHANNEL || '',
        attachments: [{
                text: message.NewStateReason,
                fields: [{
                        title: 'Time',
                        value: message.StateChangeTime,
                        short: true,
                    }, {
                        title: 'Alarm',
                        value: message.AlarmName,
                        short: true,
                    }, {
                        title: 'Account',
                        value: message.AWSAccountId,
                        short: true,
                    }, {
                        title: 'Region',
                        value: message.Region,
                        short: true,
                    }],
            }],
    });
};
exports.event = (event, context, cb) => {
    Promise.all(event.Records.map(processRecord))
        .then(() => cb(null))
        .catch((err) => cb(err));
};
//# sourceMappingURL=handler.js.map