export interface ZenviaWebhookResponse {
    id: string;
    timestamp: string;
    type: string;
    subscriptionId: string;
    channel: string;
    messageId: string;
    contentIndex: number;
    messageStatus: {
        timestamp: string;
        code: string;
        description: string;
        causes: ZenviaWebhookCauseResponse[];
        context: {
            button: {
                type: string;
                payload: string;
            };
        };
        channelData: {
            sms: {
                carrier: string;
            };
        };
    };
}

export interface ZenviaWebhookCauseResponse {
    channelErrorCode: string;
    reason: string;
    details: string;
}
