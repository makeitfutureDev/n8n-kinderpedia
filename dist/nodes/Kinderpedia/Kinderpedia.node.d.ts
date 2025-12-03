import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class Kinderpedia implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    methods: {
        loadOptions: {
            getGroup(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getFamilies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getParents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getStudents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getCustomFieldsForEntity(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
}
