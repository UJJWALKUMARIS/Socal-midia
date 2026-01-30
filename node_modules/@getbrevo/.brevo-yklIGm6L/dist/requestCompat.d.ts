/// <reference types="node" />
import { AxiosResponse } from 'axios';
import { IncomingMessage as HttpIncomingMessage } from 'http';
export interface RequestOptions {
    method?: string;
    url?: string;
    uri?: string;
    params?: any;
    headers?: any;
    data?: any;
    form?: any;
    formData?: any;
    useQuerystring?: boolean;
    json?: boolean;
    body?: any;
    auth?: {
        username: string;
        password: string;
    };
    qs?: any;
    encoding?: any;
}
export declare class IncomingMessage extends HttpIncomingMessage {
    statusCode?: number;
    statusMessage?: string;
    constructor(res: AxiosResponse);
}
declare function request(options: RequestOptions, callback: (error: any, response: IncomingMessage, body: any) => void): void;
export default request;
