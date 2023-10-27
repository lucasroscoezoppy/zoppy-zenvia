import { Message, MessageTypeEnum } from '@ZoppyTech/models';
import { StringUtil, WhatsappUtil } from '@ZoppyTech/utilities';
import { ZenviaSmsRequest } from '../request/zenvia-sms.request';
import { ZenviaUtil } from '../util/zenvia.util';
import { AxiosResponse } from 'axios';
import { ZenviaService } from '../service/zenvia.service';

export class ZenviaSmsHelper {
    public static async send(request: ZenviaSmsRequest): Promise<string> {
        const messageCount: number = Math.ceil(request.text.length / 160);

        if (messageCount > 1) return null;

        await Message.create({
            id: StringUtil.generateUuid(),
            type: MessageTypeEnum.SMS,
            count: messageCount,
            createdAt: new Date(),
            updatedAt: new Date(),
            companyId: request.companyId,
            alertId: request.alertId
        });

        const body: any = {
            from: 'sms-account',
            to: WhatsappUtil.getFullPhone(request.phone),
            contents: [
                {
                    type: 'text',
                    text: ZenviaUtil.removeAccents(request.text)
                }
            ],
            conversation: {
                solution: 'conversion'
            }
        };

        const response: AxiosResponse = await ZenviaService.post(body);
        return response.data?.id;
    }
}
