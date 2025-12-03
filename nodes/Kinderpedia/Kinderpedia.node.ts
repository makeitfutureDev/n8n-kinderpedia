import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class Kinderpedia implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kinderpedia',
		name: 'kinderpedia',
		icon: 'file:kinderpedia.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Kinderpedia API',
		defaults: {
			name: 'Kinderpedia',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'kinderpediaApi',
				required: true,
			},
		],
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Student',
						value: 'student',
					},
										{
						name: 'Parent',
						value: 'parent',
					},
										{
						name: 'Family',
						value: 'family',
					},
										{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Custom Field',
						value: 'customField',
					},

				],
				default: 'student',
			},

			// =====================================
			// STUDENT OPERATIONS
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['student'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new student',
						action: 'Create a student',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a student',
						action: 'Get a student',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many students',
						action: 'Get many students',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for students with filters',
						action: 'Search students',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a student',
						action: 'Update a student',
					},
				],
				default: 'getAll',
			},

			// =====================================
			// PARENT OPERATIONS
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['parent'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new parent',
						action: 'Create a parent',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a parent',
						action: 'Get a parent',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many parents',
						action: 'Get many parents',
					},
				],
				default: 'getAll',
			},

			// =====================================
			// GROUP OPERATIONS
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a group',
						action: 'Get a group',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many groups',
						action: 'Get many groups',
					},
				],
				default: 'getAll',
			},

			// =====================================
			// CUSTOM FIELD OPERATIONS
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customField'],
					},
				},
				options: [
					{
						name: 'Add Value',
						value: 'addValue',
						description: 'Add a custom field value',
						action: 'Add a custom field value',
					},
					{
						name: 'Delete Value',
						value: 'deleteValue',
						description: 'Delete a custom field value',
						action: 'Delete a custom field value',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get custom field definitions',
						action: 'Get custom field definitions',
					},
					{
						name: 'Get Values',
						value: 'getValues',
						description: 'Get custom field values for an entity',
						action: 'Get custom field values',
					},
					{
						name: 'Update Value',
						value: 'updateValue',
						description: 'Update a custom field value',
						action: 'Update a custom field value',
					},
				],
				default: 'getAll',
			},

			// Custom Field: Entity Type (for Get Many)
			{
				displayName: 'Entity Type',
				name: 'entityType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['getAll'],
					},
				},
				options: [
					{ name: 'Students', value: 'students' },
					{ name: 'Parents', value: 'parents' },
					{ name: 'Staff Members', value: 'staff_members' },
					{ name: 'Teachers', value: 'teachers' },
				],
				default: 'students',
				description: 'The entity type to get custom fields for',
			},

			// Custom Field: Entity Type (for Get Values)
			{
				displayName: 'Entity Type',
				name: 'entityType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['getValues'],
					},
				},
				options: [
					{ name: 'Students', value: 'students' },
					{ name: 'Parents', value: 'parents' },
					{ name: 'Staff Members', value: 'kg_admins' },
					{ name: 'Teachers', value: 'teachers' },
				],
				default: 'students',
				description: 'The entity type to get custom field values for',
			},
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'number',
				required: false,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['getValues'],
					},
				},
				default: 0,
				description: 'The ID of the entity (Student ID, Parent ID, etc.). Leave empty or 0 to get all entities with their custom field values.',
			},

			// Custom Field: Add Value fields
			{
				displayName: 'Attribute ID',
				name: 'attributeId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['addValue'],
					},
				},
				default: null,
				description: 'The ID of the custom field attribute',
			},
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['addValue'],
					},
				},
				default: null,
				description: 'The ID of the entity (Student ID, Parent ID, etc.)',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['addValue'],
					},
				},
				default: '',
				description: 'The value to set for the custom field',
			},

			// Custom Field: Update Value fields
			{
				displayName: 'Entity Type',
				name: 'updateEntityType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['updateValue'],
					},
				},
				options: [
					{ name: 'Students', value: 'students' },
					{ name: 'Parents', value: 'parents' },
					{ name: 'Staff Members', value: 'staff_members' },
					{ name: 'Teachers', value: 'teachers' },
				],
				default: 'students',
				description: 'The entity type to update custom fields for',
			},
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['updateValue'],
					},
				},
				default: 0,
				description: 'The ID of the entity (Student ID, Parent ID, etc.)',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['updateValue'],
					},
				},
				default: {},
				placeholder: 'Add Custom Field',
				options: [
					{
						name: 'fields',
						displayName: 'Field',
						values: [
							{
								displayName: 'Attribute',
								name: 'attributeId',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getCustomFieldsForEntity',
									loadOptionsDependsOn: ['updateEntityType'],
								},
								default: '',
								description: 'The custom field to update',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'The new value for the custom field',
							},
						],
					},
				],
				description: 'Custom fields to update',
			},

			// Custom Field: Delete Value fields
			{
				displayName: 'Attribute ID',
				name: 'attributeId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['deleteValue'],
					},
				},
				default: 0,
				description: 'The ID of the custom field attribute',
			},
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['customField'],
						operation: ['deleteValue'],
					},
				},
				default: 0,
				description: 'The ID of the entity (Student ID, Parent ID, etc.)',
			},

			// =====================================
			// FAMILY OPERATIONS
			// =====================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['family'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a family',
						action: 'Get a family',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many families',
						action: 'Get many families',
					},
				],
				default: 'getAll',
			},

			// =====================================
			// STUDENT FIELDS
			// =====================================
			// Student ID (for get/update)
			{
				displayName: 'Student ID',
				name: 'studentId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['get', 'update'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getStudents',
				},
				default: '',
				description: 'Select the student',
			},

			// Student: Get Many
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 30,
				description: 'Max number of results to return',
			},

			// Student: Create
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['create'],
					},
				},
				options: [
					{ name: 'Male', value: 'm' },
					{ name: 'Female', value: 'f' },
				],
				default: 'm',
			},
			{
				displayName: 'Birthdate',
				name: 'birthdate',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Date of birth',
			},
			{
				displayName: 'Family ID',
				name: 'familyId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['create'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getFamilies',
				},
				default: 0,
				description: 'Select a family (0 creates a new family)',
			},
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['create'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getGroup',
				},
				default: '',
				description: 'Select the group/class for the student',
			},

			// Student: Update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Gender',
						name: 'gender',
						type: 'options',
						options: [
							{ name: 'Male', value: 'm' },
							{ name: 'Female', value: 'f' },
						],
						default: 'm',
					},
					{
						displayName: 'Birthdate',
						name: 'birthdate',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
					},
				],
			},

			// Student: Search
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['search'],
					},
				},
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Student account status',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['search'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['search'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 30,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['student'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Group ID',
						name: 'groupId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getGroup',
						},
						default: undefined,
						description: 'Filter by main or secondary group',
					},
					{
						displayName: 'Include Context',
						name: 'includeContext',
						type: 'multiOptions',
						options: [
							{ name: 'Current Main Group', value: 'main_group' },
							{ name: 'Current Secondary Groups', value: 'secondary_groups' },
							{ name: 'Properties in Current School', value: 'properties_current_school' },
							{ name: 'Parents', value: 'parents' },
							{ name: 'Student Custom Fields', value: 'student_eavs' },
							{ name: 'Family', value: 'family' },
						],
						default: [],
						description: 'Additional properties to include in the response',
					},
					{
						displayName: 'Items Per Page',
						name: 'itemsPerPage',
						type: 'number',
						default: 30,
						description: 'Number of items to return per page',
					},
				],
			},

			// =====================================
			// PARENT FIELDS
			// =====================================
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['get'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getParents',
				},
				default: '',
				description: 'Select the parent',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 30,
				description: 'Max number of results to return',
			},

			// Parent: Create
			{
				displayName: 'Email',
				name: 'emailInfo',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				default: '',
			},
			{
				displayName: 'Family ID',
				name: 'familyId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getFamilies',
				},
				default: 0,
				description: 'Select the family to attach this parent to',
			},
			{
				displayName: 'Family Account Type',
				name: 'familyAcctype',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				options: [
					{ name: 'Mother', value: 'mother' },
					{ name: 'Father', value: 'father' },
					{ name: 'Grandfather', value: 'grandfather' },
					{ name: 'Grandmother', value: 'grandmother' },
					{ name: 'Tutor', value: 'tutor' },
					{ name: 'Nanny', value: 'nanny' },
					{ name: 'Student', value: 'student' },
					{ name: 'Stepfather', value: 'stepfather' },
					{ name: 'Stepmother', value: 'stepmother' },
					{ name: 'Sister', value: 'sister' },
					{ name: 'Brother', value: 'brother' },
					{ name: 'Uncle', value: 'uncle' },
					{ name: 'Aunt', value: 'aunt' },
					{ name: 'Other Guardian', value: 'otherguardian' },
					{ name: 'Consultant', value: 'consultant' },
				],
				default: 'mother',
				description: 'The role of the family member',
			},
			{
				displayName: 'Main Family Account',
				name: 'familyMainAccount',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				default: false,
				description: 'Whether this is the primary family account (only one per family)',
			},
			{
				displayName: 'Family Pickup Permission',
				name: 'familyPickup',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['parent'],
						operation: ['create'],
					},
				},
				default: true,
				description: 'Whether this family member is authorized to pick up children',
			},

			// =====================================
			// GROUP FIELDS
			// =====================================
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['get'],
					},
					
				},
				typeOptions: {
					loadOptionsMethod: 'getGroup',
				},
				default: 0,
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 30,
				description: 'Max number of results to return',
			},

			// =====================================
			// FAMILY FIELDS
			// =====================================
			{
				displayName: 'Family ID',
				name: 'familyId',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['family'],
						operation: ['get'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getFamilies',
				},
				default: '',
				description: 'Select the family',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['family'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['family'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 30,
				description: 'Max number of results to return',
			},

			// =====================================
			// OPTIONS (for all getAll operations)
			// =====================================
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Items Per Page',
						name: 'itemsPerPage',
						type: 'number',
						default: 30,
						description: 'Number of items to return per page',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('kinderpediaApi');
		const baseUrl = credentials.environment as string;
		const apiKey = credentials.apiKey as string;
		const schoolId = credentials.schoolId as number;

		const headers = {
			'Public-Api-Key': apiKey,
			'School-ID': String(schoolId),
			'Content-Type': 'application/ld+json',
			'Accept': 'application/ld+json',
		};

		for (let i = 0; i < items.length; i++) {
			try {
				// =====================================
				// STUDENT OPERATIONS
				// =====================================
				if (resource === 'student') {
					// Get Many Students
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;
						const itemsPerPage = (options.itemsPerPage as number) || 30;
						const limit = !returnAll ? (this.getNodeParameter('limit', i) as number) : null;

						let page = 1;
						let hasMore = true;

						while (hasMore) {
							const response = await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/v1/students`,
								qs: { page, itemsPerPage },
								headers,
								json: true,
							});

							// Handle both array and hydra:member response formats
							const members = Array.isArray(response) ? response : (response['hydra:member'] as IDataObject[]);
							
							if (!members || members.length === 0) {
								hasMore = false;
								break;
							}

							returnData.push(...members);

							if (returnAll) {
								const totalItems = Array.isArray(response) 
									? response.length 
									: (response['hydra:totalItems'] as number);
								hasMore = (page * itemsPerPage) < totalItems && members.length === itemsPerPage;
								page++;
							} else {
								// Exit the loop after first request when not returning all
								hasMore = false;
								// Trim to the limit
								if (returnData.length > limit!) {
									returnData.splice(limit!);
								}
							}
						}
					}

					// Get One Student
					if (operation === 'get') {
						const studentId = this.getNodeParameter('studentId', i) as number;
						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/v1/students/${studentId}`,
							headers,
							json: true,
						});
						returnData.push(response as IDataObject);
					}

					// Create Student
					if (operation === 'create') {
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const gender = this.getNodeParameter('gender', i) as string;
						const birthdate = this.getNodeParameter('birthdate', i) as string;
						const familyId = this.getNodeParameter('familyId', i) as number;
						const groupId = this.getNodeParameter('groupId', i) as number;

						const body: IDataObject = {
							firstName,
							lastName,
							gender,
							birthdate: new Date(birthdate).toISOString().split('T')[0],
							familyId,
							groupId,
						};

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/v1/students`,
							headers,
							body,
							json: true,
						});
						returnData.push(response as IDataObject);
					}

					// Search Students
					if (operation === 'search') {
						const status = this.getNodeParameter('status', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const itemsPerPage = (filters.itemsPerPage as number) || 30;
						const limit = !returnAll ? (this.getNodeParameter('limit', i) as number) : null;

						let page = 1;
						let hasMore = true;

						while (hasMore) {
							// Build query string
							const qs: IDataObject = {
								'propertiesCurrentSchool.status': status,
								itemsPerPage,
								page,
							};

							// Add optional filters
							if (filters.groupId !== undefined && filters.groupId !== null && filters.groupId !== '') {
								qs['groups.group.id'] = Number(filters.groupId);
							}
							if (filters.includeContext && Array.isArray(filters.includeContext) && filters.includeContext.length > 0) {
								// Pass each includeContext value as a separate parameter
								qs['includeContext[]'] = filters.includeContext;
							}

							const response = await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/v1/students`,
								qs,
								headers,
								json: true,
							});

							const members = Array.isArray(response) ? response : (response['hydra:member'] as IDataObject[]);

							if (!members || members.length === 0) {
								hasMore = false;
								break;
							}

							returnData.push(...members);

							if (returnAll) {
								const totalItems = Array.isArray(response)
									? response.length
									: (response['hydra:totalItems'] as number);
								hasMore = (page * itemsPerPage) < totalItems && members.length === itemsPerPage;
								page++;
							} else {
								// Exit the loop after first request when not returning all
								hasMore = false;
								// Trim to the limit
								if (returnData.length > limit!) {
									returnData.splice(limit!);
								}
							}
						}
					}

					// Update Student
					if (operation === 'update') {
						const studentId = this.getNodeParameter('studentId', i) as number;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

						const body: IDataObject = { ...updateFields };

						if (body.birthdate) {
							body.birthdate = new Date(body.birthdate as string).toISOString().split('T')[0];
						}

						const response = await this.helpers.httpRequest({
							method: 'PATCH',
							url: `${baseUrl}/v1/students/${studentId}`,
							headers,
							body,
							json: true,
						});
						returnData.push(response as IDataObject);
					}
				}

				// =====================================
				// PARENT OPERATIONS
				// =====================================
				if (resource === 'parent') {
					// Get Many Parents
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;
						const itemsPerPage = (options.itemsPerPage as number) || 30;
						const limit = !returnAll ? (this.getNodeParameter('limit', i) as number) : null;

						let page = 1;
						let hasMore = true;

						while (hasMore) {
							const response = await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/v1/parents`,
								qs: { page, itemsPerPage },
								headers,
								json: true,
							});

							// Handle both array and hydra:member response formats
							const members = Array.isArray(response) ? response : (response['hydra:member'] as IDataObject[]);
							
							if (!members || members.length === 0) {
								hasMore = false;
								break;
							}

							returnData.push(...members);

							if (returnAll) {
								const totalItems = Array.isArray(response) 
									? response.length 
									: (response['hydra:totalItems'] as number);
								hasMore = (page * itemsPerPage) < totalItems && members.length === itemsPerPage;
								page++;
							} else {
								// Exit the loop after first request when not returning all
								hasMore = false;
								// Trim to the limit
								if (returnData.length > limit!) {
									returnData.splice(limit!);
								}
							}
						}
					}

					// Get One Parent
					if (operation === 'get') {
						const parentId = this.getNodeParameter('parentId', i) as number;
						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/v1/parents/${parentId}`,
							headers,
							json: true,
						});
						returnData.push(response as IDataObject);
					}

					// Create Parent
					if (operation === 'create') {
						const emailInfo = this.getNodeParameter('emailInfo', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const phone = this.getNodeParameter('phone', i, '') as string;
						const address = this.getNodeParameter('address', i, '') as string;
						const familyId = this.getNodeParameter('familyId', i) as number;
						const familyAcctype = this.getNodeParameter('familyAcctype', i) as string;
						const familyMainAccount = this.getNodeParameter('familyMainAccount', i) as boolean;
						const familyPickup = this.getNodeParameter('familyPickup', i) as boolean;

						const body: IDataObject = {
							emailInfo,
							firstName,
							lastName,
							phone,
							address,
							familyId,
							familyAcctype,
							familyMainAccount,
							familyPickup,
						};

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/v1/parents`,
							headers,
							body,
							json: true,
						});
						returnData.push(response as IDataObject);
					}
				}

				// =====================================
				// GROUP OPERATIONS
				// =====================================
				if (resource === 'group') {
					// Get Many Groups
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;
						const itemsPerPage = (options.itemsPerPage as number) || 30;
						const limit = !returnAll ? (this.getNodeParameter('limit', i) as number) : null;

						let page = 1;
						let hasMore = true;

						while (hasMore) {
							const response = await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/v1/groups`,
								qs: { page, itemsPerPage },
								headers,
								json: true,
							});

							// Handle both array and hydra:member response formats
							const members = Array.isArray(response) ? response : (response['hydra:member'] as IDataObject[]);
							
							if (!members || members.length === 0) {
								hasMore = false;
								break;
							}

							returnData.push(...members);

							if (returnAll) {
								const totalItems = Array.isArray(response) 
									? response.length 
									: (response['hydra:totalItems'] as number);
								hasMore = (page * itemsPerPage) < totalItems && members.length === itemsPerPage;
								page++;
							} else {
								// Exit the loop after first request when not returning all
								hasMore = false;
								// Trim to the limit
								if (returnData.length > limit!) {
									returnData.splice(limit!);
								}
							}
						}
					}

					// Get One Group
					if (operation === 'get') {
						const groupId = this.getNodeParameter('groupId', i) as number;
						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/v1/groups/${groupId}`,
							headers,
							json: true,
						});
						returnData.push(response as IDataObject);
					}
				}

				// =====================================
				// CUSTOM FIELD OPERATIONS
				// =====================================
				if (resource === 'customField') {
					// Get Many Custom Field Definitions
					if (operation === 'getAll') {
						const entityType = this.getNodeParameter('entityType', i) as string;

						let page = 1;
						let hasMore = true;

						while (hasMore) {
							const response = await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/v1/eav_attributes`,
								qs: {
									entityType,
									page,
									itemsPerPage: 100,
								},
								headers,
								json: true,
							});

							const members = Array.isArray(response) ? response : (response['hydra:member'] as IDataObject[]);

							if (!members || members.length === 0) {
								hasMore = false;
								break;
							}

							returnData.push(...members);

							const totalItems = Array.isArray(response)
								? response.length
								: (response['hydra:totalItems'] as number);
							hasMore = (page * 100) < totalItems && members.length === 100;
							page++;
						}
					}

					// Get Custom Field Values for an Entity
					if (operation === 'getValues') {
						const entityType = this.getNodeParameter('entityType', i) as string;
						const entityId = this.getNodeParameter('entityId', i, 0) as number;

						// Determine the correct includeContext based on entity type
						let includeContext = 'student_eavs';
						if (entityType === 'parents') {
							includeContext = 'parent_eavs';
						} else if (entityType === 'kg_admins') {
							includeContext = 'staff_member_eavs';
						} else if (entityType === 'teachers') {
							includeContext = 'teacher_eavs';
						}

						// Build URL - include entityId only if it's provided and not 0
						let url: string;
						if (entityId && entityId !== 0) {
							url = `${baseUrl}/v1/${entityType}/${entityId}?includeContext[]=${includeContext}`;
							const response = await this.helpers.httpRequest({
								method: 'GET',
								url,
								headers,
								json: true,
							});
							returnData.push(response as IDataObject);
						} else {
							// Get all entities with custom field values (paginated)
							let page = 1;
							let hasMore = true;
							const itemsPerPage = 30;

							while (hasMore) {
								url = `${baseUrl}/v1/${entityType}?includeContext[]=${includeContext}&page=${page}&itemsPerPage=${itemsPerPage}`;
								const response = await this.helpers.httpRequest({
									method: 'GET',
									url,
									headers,
									json: true,
								});

								const members = Array.isArray(response) ? response : (response['hydra:member'] as IDataObject[]);

								if (!members || members.length === 0) {
									hasMore = false;
									break;
								}

								returnData.push(...members);

								const totalItems = Array.isArray(response)
									? response.length
									: (response['hydra:totalItems'] as number);
								hasMore = (page * itemsPerPage) < totalItems && members.length === itemsPerPage;
								page++;
							}
						}
					}

					// Add Custom Field Value
					if (operation === 'addValue') {
						const attributeId = this.getNodeParameter('attributeId', i) as number;
						const entityId = this.getNodeParameter('entityId', i) as number;
						const value = this.getNodeParameter('value', i) as string;

						// Validate required fields
						if (!attributeId || attributeId === 0) {
							throw new NodeOperationError(this.getNode(), 'Attribute ID is required and must be a valid ID', { itemIndex: i });
						}
						if (!entityId || entityId === 0) {
							throw new NodeOperationError(this.getNode(), 'Entity ID is required and must be a valid ID', { itemIndex: i });
						}
						if (!value || value.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Value is required and cannot be empty', { itemIndex: i });
						}

						const body = {
							attributeId,
							entityId,
							value,
						};

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/v1/eav_values`,
							headers,
							body,
							json: true,
						});

						returnData.push(response as IDataObject);
					}

					// Update Custom Field Value
					if (operation === 'updateValue') {
						const entityId = this.getNodeParameter('entityId', i) as number;
						const customFields = this.getNodeParameter('customFields', i) as IDataObject;

						// Validate required fields
						if (!entityId || entityId === 0) {
							throw new NodeOperationError(this.getNode(), 'Entity ID is required and must be a valid ID', { itemIndex: i });
						}

						// Get the fields array from the fixedCollection
						const fields = (customFields.fields as IDataObject[]) || [];

						if (fields.length === 0) {
							throw new NodeOperationError(this.getNode(), 'At least one custom field must be specified', { itemIndex: i });
						}

						// Process each custom field
						const results: IDataObject[] = [];
						for (const field of fields) {
							const attributeId = field.attributeId as number;
							const value = field.value as string;

							// Validate field data
							if (!attributeId || attributeId === 0) {
								throw new NodeOperationError(this.getNode(), 'Attribute ID is required for each custom field', { itemIndex: i });
							}
							if (!value || value.trim() === '') {
								throw new NodeOperationError(this.getNode(), 'Value is required for each custom field', { itemIndex: i });
							}

							const body = {
								attributeId,
								entityId,
								value,
							};

							const response = await this.helpers.httpRequest({
								method: 'PATCH',
								url: `${baseUrl}/v1/eav_values`,
								headers,
								body,
								json: true,
							});

							results.push(response as IDataObject);
						}

						// Return all results
						returnData.push(...results);
					}

					// Delete Custom Field Value
					if (operation === 'deleteValue') {
						const attributeId = this.getNodeParameter('attributeId', i) as number;
						const entityId = this.getNodeParameter('entityId', i) as number;

						// Validate required fields
						if (!attributeId || attributeId === 0) {
							throw new NodeOperationError(this.getNode(), 'Attribute ID is required and must be a valid ID', { itemIndex: i });
						}
						if (!entityId || entityId === 0) {
							throw new NodeOperationError(this.getNode(), 'Entity ID is required and must be a valid ID', { itemIndex: i });
						}

						try {
							await this.helpers.httpRequest({
								method: 'DELETE',
								url: `${baseUrl}/v1/eav_values`,
								qs: {
									attributeId,
									entityId,
								},
								headers,
								json: true,
							});

							returnData.push({ success: true, message: 'Custom field value deleted successfully' });
						} catch (error: any) {
							// API returns 404 when value doesn't exist - this is acceptable
							if (error.statusCode === 404 || error.response?.status === 404) {
								returnData.push({ success: true, message: 'Value not found (already deleted or never existed)' });
							} else {
								throw error;
							}
						}
					}
				}

				// =====================================
				// FAMILY OPERATIONS
				// =====================================
				if (resource === 'family') {
					// Get Many Families
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;
						const itemsPerPage = (options.itemsPerPage as number) || 30;
						const limit = !returnAll ? (this.getNodeParameter('limit', i) as number) : null;

						let page = 1;
						let hasMore = true;

						while (hasMore) {
							const response = await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/v1/families`,
								qs: { page, itemsPerPage },
								headers,
								json: true,
							});

							// Handle both array and hydra:member response formats
							const members = Array.isArray(response) ? response : (response['hydra:member'] as IDataObject[]);
							
							if (!members || members.length === 0) {
								hasMore = false;
								break;
							}

							returnData.push(...members);

							if (returnAll) {
								const totalItems = Array.isArray(response) 
									? response.length 
									: (response['hydra:totalItems'] as number);
								hasMore = (page * itemsPerPage) < totalItems && members.length === itemsPerPage;
								page++;
							} else {
								// Exit the loop after first request when not returning all
								hasMore = false;
								// Trim to the limit
								if (returnData.length > limit!) {
									returnData.splice(limit!);
								}
							}
						}
					}

					// Get One Family
					if (operation === 'get') {
						const familyId = this.getNodeParameter('familyId', i) as number;
						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/v1/families/${familyId}`,
							headers,
							json: true,
						});
						returnData.push(response as IDataObject);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({ error: errorMessage });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}

	methods = {
		loadOptions: {
			async getGroup(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('kinderpediaApi');
				const baseUrl = credentials.environment as string;
				const apiKey = credentials.apiKey as string;
				const schoolId = credentials.schoolId as number;

				const headers = {
					'Public-Api-Key': apiKey,
					'School-ID': String(schoolId),
					'Content-Type': 'application/ld+json',
					'Accept': 'application/ld+json',
				};

				let response;
				try {
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/v1/groups`,
						qs: {
							page: 1,
							itemsPerPage: 100,
						},
						headers,
						json: true,
					});
				} catch (error) {
					return [
						{
							name: 'No groups found - check API credentials',
							value: '',
						},
					];
				}

				const groups = Array.isArray(response) ? response : (response['hydra:member'] || []);

				if (groups.length === 0) {
					return [
						{
							name: 'No groups available',
							value: '',
						},
					];
				}

				return groups.map((group: any) => ({
					name: group.name || `Group ${group.id}`,
					value: group.id,
				}));
			},

			async getFamilies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('kinderpediaApi');
				const baseUrl = credentials.environment as string;
				const apiKey = credentials.apiKey as string;
				const schoolId = credentials.schoolId as number;

				const headers = {
					'Public-Api-Key': apiKey,
					'School-ID': String(schoolId),
					'Content-Type': 'application/ld+json',
					'Accept': 'application/ld+json',
				};

				let response;
				try {
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/v1/families`,
						qs: {
							page: 1,
							itemsPerPage: 100,
						},
						headers,
						json: true,
					});
				} catch (error) {
					return [
						{
							name: 'No families found - check API credentials',
							value: '',
						},
					];
				}

				const families = Array.isArray(response) ? response : (response['hydra:member'] || []);

				if (families.length === 0) {
					return [
						{
							name: 'No families available',
							value: '',
						},
					];
				}

				return families.map((family: any) => ({
					name: family.name || `Family ${family.id}`,
					value: family.id,
				}));
			},

			async getParents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('kinderpediaApi');
				const baseUrl = credentials.environment as string;
				const apiKey = credentials.apiKey as string;
				const schoolId = credentials.schoolId as number;

				const headers = {
					'Public-Api-Key': apiKey,
					'School-ID': String(schoolId),
					'Content-Type': 'application/ld+json',
					'Accept': 'application/ld+json',
				};

				let response;
				try {
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/v1/parents`,
						qs: {
							page: 1,
							itemsPerPage: 100,
						},
						headers,
						json: true,
					});
				} catch (error) {
					return [
						{
							name: 'No parents found - check API credentials',
							value: '',
						},
					];
				}

				const parents = Array.isArray(response) ? response : (response['hydra:member'] || []);

				if (parents.length === 0) {
					return [
						{
							name: 'No parents available',
							value: '',
						},
					];
				}

				return parents.map((parent: any) => ({
					name: `${parent.firstName} ${parent.lastName} (${parent.emailInfo})`,
					value: parent.id,
				}));
			},

			async getStudents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('kinderpediaApi');
				const baseUrl = credentials.environment as string;
				const apiKey = credentials.apiKey as string;
				const schoolId = credentials.schoolId as number;

				const headers = {
					'Public-Api-Key': apiKey,
					'School-ID': String(schoolId),
					'Content-Type': 'application/ld+json',
					'Accept': 'application/ld+json',
				};

				let response;
				try {
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/v1/students`,
						qs: {
							page: 1,
							itemsPerPage: 100,
						},
						headers,
						json: true,
					});
				} catch (error) {
					return [
						{
							name: 'No students found - check API credentials',
							value: '',
						},
					];
				}

				const students = Array.isArray(response) ? response : (response['hydra:member'] || []);

				if (students.length === 0) {
					return [
						{
							name: 'No students available',
							value: '',
						},
					];
				}

				return students.map((student: any) => ({
					name: `${student.firstName} ${student.lastName}`,
					value: student.id,
				}));
			},

			async getCustomFieldsForEntity(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('kinderpediaApi');
				const baseUrl = credentials.environment as string;
				const apiKey = credentials.apiKey as string;
				const schoolId = credentials.schoolId as number;

				const headers = {
					'Public-Api-Key': apiKey,
					'School-ID': String(schoolId),
					'Content-Type': 'application/ld+json',
					'Accept': 'application/ld+json',
				};

				// Get the entity type from the current parameters
				const entityType = this.getCurrentNodeParameter('updateEntityType') as string;

				if (!entityType) {
					return [
						{
							name: 'Please select an entity type first',
							value: '',
						},
					];
				}

				let allCustomFields: any[] = [];
				let page = 1;
				let hasMore = true;

				try {
					while (hasMore) {
						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/v1/eav_attributes`,
							qs: {
								entityType,
								page,
								itemsPerPage: 100,
							},
							headers,
							json: true,
						});

						const members = Array.isArray(response) ? response : (response['hydra:member'] || []);

						if (!members || members.length === 0) {
							hasMore = false;
							break;
						}

						allCustomFields.push(...members);

						const totalItems = Array.isArray(response)
							? response.length
							: (response['hydra:totalItems'] as number);
						hasMore = (page * 100) < totalItems && members.length === 100;
						page++;
					}
				} catch (error) {
					return [
						{
							name: 'Error loading custom fields - check API credentials',
							value: '',
						},
					];
				}

				if (allCustomFields.length === 0) {
					return [
						{
							name: 'No custom fields available for this entity type',
							value: '',
						},
					];
				}

				return allCustomFields.map((field: any) => ({
					name: field.label || field.attributeName || `Field ${field.id}`,
					value: field.id,
				}));
			},
		},
	};
}
