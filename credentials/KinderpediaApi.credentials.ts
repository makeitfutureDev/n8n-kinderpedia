import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KinderpediaApi implements ICredentialType {
	name = 'kinderpediaApi';
	displayName = 'Kinderpedia API';
	documentationUrl = 'https://openapi-documentation.kinderpedia.co/';
	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Public-Api-Key': '={{$credentials.apiKey}}',
				'School-ID': '={{$credentials.schoolId}}',
				'Content-Type': 'application/ld+json',
			},
		},
	};

	test: ICredentialTestRequest = {
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
