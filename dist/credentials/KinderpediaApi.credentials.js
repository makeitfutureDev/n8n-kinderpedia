"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinderpediaApi = void 0;
class KinderpediaApi {
    constructor() {
        this.name = 'kinderpediaApi';
        this.displayName = 'Kinderpedia API';
        this.documentationUrl = 'https://openapi-documentation.kinderpedia.co/';
        this.properties = [
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                options: [
                    {
                        name: 'Production',
                        value: 'https://openapi.kinderpedia.co/api',
                    },
                    {
                        name: 'Sandbox',
                        value: 'https://openapi-dev.kinderpedia.co/api',
                    },
                ],
                default: 'https://openapi.kinderpedia.co/api',
                description: 'The environment to use for API requests',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your Kinderpedia API Key',
            },
            {
                displayName: 'School ID',
                name: 'schoolId',
                type: 'number',
                default: 0,
                required: true,
                description: 'Your School ID',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'Public-Api-Key': '={{$credentials.apiKey}}',
                    'School-ID': '={{$credentials.schoolId}}',
                    'Content-Type': 'application/ld+json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.environment}}',
                url: '/v1/students',
                method: 'GET',
                qs: {
                    itemsPerPage: 1,
                },
            },
        };
    }
}
exports.KinderpediaApi = KinderpediaApi;
