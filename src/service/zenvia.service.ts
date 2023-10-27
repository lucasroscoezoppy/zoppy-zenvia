import { LogService } from '@ZoppyTech/utilities';
import axios, { AxiosResponse } from 'axios';

export class ZenviaService {
    public static URL = process.env.SMS_ZENVIA_URL;
    public static HEADERS = {
        'Content-Type': 'application/json',
        'X-API-TOKEN': process.env.SMS_ZENVIA_TOKEN
    };

    public static async post(body: any): Promise<AxiosResponse> {
        await LogService.info({
            message: {
                message: `Post Zenvia API`,
                url: this.URL,
                body: JSON.stringify(body),
                headers: this.HEADERS
            }
        });

        const response: AxiosResponse = await axios.post(this.URL, body, {
            headers: this.HEADERS
        });

        return response;
    }
}
