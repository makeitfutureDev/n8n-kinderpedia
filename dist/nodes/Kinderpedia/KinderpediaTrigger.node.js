"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinderpediaTrigger = void 0;
class KinderpediaTrigger {
    constructor() {
        this.description = {
            displayName: 'Kinderpedia Trigger',
            name: 'kinderpediaTrigger',
            icon: 'file:kinderpedia.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Triggers when new students are added in Kinderpedia',
            defaults: {
                name: 'Kinderpedia Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'kinderpediaApi',
                    required: true,
                },
            ],
            polling: true,
            properties: [
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'New Student',
                            value: 'newStudent',
                            description: 'Triggers when a new student is added',
                        },
                    ],
                    default: 'newStudent',
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
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Items Per Page',
                            name: 'itemsPerPage',
                            type: 'number',
                            default: 30,
                            description: 'Number of items to return per page (max 100)',
                            typeOptions: {
                                minValue: 1,
                                maxValue: 100,
                            },
                        },
                    ],
                },
            ],
        };
    }
    async poll() {
        const webhookData = this.getWorkflowStaticData('node');
        const event = this.getNodeParameter('event');
        const includeContext = this.getNodeParameter('includeContext', []);
        const options = this.getNodeParameter('options', {});
        const credentials = await this.getCredentials('kinderpediaApi');
        const baseUrl = credentials.environment;
        const apiKey = credentials.apiKey;
        const schoolId = credentials.schoolId;
        const headers = {
            'Public-Api-Key': apiKey,
            'School-ID': String(schoolId),
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json',
        };
        const returnData = [];
        if (event === 'newStudent') {
            const itemsPerPage = options.itemsPerPage || 30;
            // Build query string
            const qs = {
                page: 1,
                itemsPerPage,
            };
            // Add includeContext if specified
            if (includeContext && includeContext.length > 0) {
                qs['includeContext[]'] = includeContext;
            }
            try {
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/v1/students`,
                    qs,
                    headers,
                    json: true,
                });
                const students = Array.isArray(response) ? response : response['hydra:member'];
                if (!students || students.length === 0) {
                    return null;
                }
                // Get the last processed date from webhook data
                const lastProcessedDate = webhookData.lastProcessedDate;
                const lastProcessedIds = webhookData.lastProcessedIds || [];
                // Filter for new students based on dateadd
                const newStudents = [];
                let newestDate = null;
                const newProcessedIds = [];
                for (const student of students) {
                    const studentId = student['@id'] || String(student.id);
                    const dateAdded = student.dateadd;
                    // Track the newest date we've seen
                    if (!newestDate || (dateAdded && dateAdded > newestDate)) {
                        newestDate = dateAdded;
                    }
                    // Skip if we've already processed this student
                    if (lastProcessedIds.includes(studentId)) {
                        continue;
                    }
                    // If this is the first run, or if the student was added after our last check
                    if (!lastProcessedDate || (dateAdded && dateAdded > lastProcessedDate)) {
                        newStudents.push(student);
                        newProcessedIds.push(studentId);
                    }
                }
                // Update the webhook data with the newest date and processed IDs
                if (newestDate) {
                    webhookData.lastProcessedDate = newestDate;
                }
                // Keep track of recently processed IDs to avoid duplicates
                webhookData.lastProcessedIds = [...newProcessedIds, ...lastProcessedIds].slice(0, 100);
                // If this is the first run (no lastProcessedDate), don't return anything
                // This prevents triggering on all existing students
                if (!lastProcessedDate) {
                    return null;
                }
                // Return new students
                for (const student of newStudents) {
                    returnData.push({
                        json: student,
                    });
                }
                if (returnData.length === 0) {
                    return null;
                }
                return [returnData];
            }
            catch (error) {
                throw error;
            }
        }
        return null;
    }
}
exports.KinderpediaTrigger = KinderpediaTrigger;
