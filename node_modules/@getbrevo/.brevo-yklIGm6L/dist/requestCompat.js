"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomingMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const http_1 = require("http");
class IncomingMessage extends http_1.IncomingMessage {
    constructor(res) {
        const mockSocket = {
            remoteAddress: '',
            remoteFamily: '',
            remotePort: 0,
            localAddress: '',
            localPort: 0,
            bytesRead: 0,
            bytesWritten: 0,
            connecting: false,
            destroyed: false,
            readable: true,
            writable: false,
            allowHalfOpen: false,
            timeout: 0,
            setKeepAlive: () => { },
            setNoDelay: () => { },
            setTimeout: () => { },
            unref: () => { },
            ref: () => { },
            cork: () => { },
            uncork: () => { },
            destroy: () => { },
            pause: () => { },
            resume: () => { },
            write: () => false,
            end: () => { },
            on: () => { },
            once: () => { },
            emit: () => false,
            addListener: () => { },
            removeListener: () => { },
            removeAllListeners: () => { },
            setMaxListeners: () => { },
            getMaxListeners: () => 0,
            listeners: () => [],
            rawListeners: () => [],
            listenerCount: () => 0,
            prependListener: () => { },
            prependOnceListener: () => { },
            eventNames: () => [],
        };
        super(mockSocket);
        this.statusCode = res.status;
        this.statusMessage = res.statusText;
        this.headers = res.headers;
        const responseData = res.data;
        if (typeof responseData === 'string') {
            this.push(responseData);
        }
        else if (responseData) {
            this.push(JSON.stringify(responseData));
        }
        this.push(null);
    }
}
exports.IncomingMessage = IncomingMessage;
function request(options, callback) {
    var _a;
    const axiosConfig = {
        method: (_a = options.method) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
        url: options.url || options.uri,
        params: options.params || options.qs,
        headers: options.headers,
        data: options.data || options.body,
        auth: options.auth,
    };
    if (options.form) {
        axiosConfig.headers = axiosConfig.headers || {};
        axiosConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        axiosConfig.data = new URLSearchParams(options.form).toString();
    }
    else if (options.formData) {
        axiosConfig.headers = axiosConfig.headers || {};
        axiosConfig.headers['Content-Type'] = 'multipart/form-data';
        axiosConfig.data = options.formData;
    }
    if (options.json) {
        axiosConfig.headers = axiosConfig.headers || {};
        axiosConfig.headers['Content-Type'] = 'application/json';
        if (typeof axiosConfig.data === 'object' && axiosConfig.data !== null) {
            axiosConfig.data = JSON.stringify(axiosConfig.data);
        }
    }
    (0, axios_1.default)(axiosConfig)
        .then((response) => {
        const incomingMessage = new IncomingMessage(response);
        callback(null, incomingMessage, response.data);
    })
        .catch((error) => {
        if (error.response) {
            const incomingMessage = new IncomingMessage(error.response);
            callback(error, incomingMessage, error.response.data);
        }
        else {
            callback(error, null, null);
        }
    });
}
exports.default = request;
//# sourceMappingURL=requestCompat.js.map