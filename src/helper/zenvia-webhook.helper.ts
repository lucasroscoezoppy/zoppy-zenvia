import { StringUtil } from '@ZoppyTech/utilities';
import { ZenviaWebhookResponse } from '../response/zenvia-webhook.response';
import { WebhookResponse } from '@ZoppyTech/models';
export class ZenviaWebhookHelper {
    public static async create(webhookResponse: ZenviaWebhookResponse): Promise<void> {
        try {
            await WebhookResponse.create({
                id: StringUtil.generateUuid(),
                provider: 'zenvia',
                body: webhookResponse,
                externalId: webhookResponse.id,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } catch (ex) {
            await WebhookResponse.create({
                id: StringUtil.generateUuid(),
                provider: 'zenvia',
                body: webhookResponse,
                externalId: webhookResponse.id,
                error: ex,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }
}
