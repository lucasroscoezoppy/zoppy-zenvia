export interface ZenviaSmsRequest {
    companyId: string;
    text: string;
    phone: string;
    alertId?: string;
}
