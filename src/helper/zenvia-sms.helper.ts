import {
    Address,
    Company,
    Coupon,
    CouponAlert,
    Customer,
    GiftbackConfig,
    Message,
    MessageTemplate,
    MessageTemplateGroup,
    MessageTypeEnum,
    Order,
    Product,
    User
} from '@ZoppyTech/models';
import { MessageTemplateUtil, StringUtil, WhatsappUtil } from '@ZoppyTech/utilities';
import { ZenviaSmsRequest } from '../request/zenvia-sms.request';
import { ZenviaUtil } from '../util/zenvia.util';
import { AxiosResponse } from 'axios';
import { ZenviaService } from '../service/zenvia.service';
import { MessageTemplateEntitiesResponse } from '@ZoppyTech/shared';
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
            contents: [{ type: 'text', text: ZenviaUtil.removeAccents(request.text) }],
            conversation: { solution: 'conversion' }
        };

        const response: AxiosResponse = await ZenviaService.post(body);
        return response.data?.id;
    }

    public static async sendWithTemplate(parameters: SmsTemplateParameters): Promise<string> {
        const templateParamEntities: MessageTemplateEntitiesResponse = {
            clientAddress: parameters.address,
            company: parameters.company,
            coupon: parameters.coupon,
            giftbackConfig: parameters.giftbackConfig,
            lastPurchase: parameters.order,
            lastPurchaseProducts: parameters.products,
            seller: parameters.seller
        };

        const messageGroup: MessageTemplateGroup = await MessageTemplateGroup.findOne({
            where: { companyId: parameters.company.id, identifier: parameters.alert.wppTemplateName }
        });

        if (!messageGroup) return null;

        const messageTemplate: MessageTemplate = await MessageTemplate.findOne({
            where: { companyId: parameters.company.id, messageTemplateGroupId: messageGroup.id }
        });

        const template: string = MessageTemplateUtil.replaceParameters(messageTemplate.text, templateParamEntities);
        const phone: string = WhatsappUtil.getFullPhone(parameters.address.phone);

        return await this.send({
            companyId: parameters.company.id,
            alertId: parameters.alert?.id,
            text: template,
            phone: phone
        });
    }
}

export interface SmsTemplateParameters {
    address: Address;
    customer: Customer;
    company: Company;
    coupon: Coupon;
    alert: CouponAlert;
    order: Order;
    seller: User;
    giftbackConfig: GiftbackConfig;
    products: Product[];
}
