# n8n-nodes-kinderpedia

This is an n8n community node that allows you to use Kinderpedia API in your n8n workflows.

[Kinderpedia](https://kinderpedia.co/) is a platform for managing educational institutions.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Student
- **Get Many**: Retrieve multiple students

### Parent
- **Get Many**: Retrieve multiple parents

### Group
- **Get Many**: Retrieve multiple groups

## Credentials

To use this node, you need:
- **API Key**: Your Kinderpedia API key
- **School ID**: Your school identifier
- **Environment**: Choose between Production or Sandbox

## Compatibility

Tested with n8n version 1.0.0 and above.

## Usage

1. Add your Kinderpedia credentials in n8n
2. Add the Kinderpedia node to your workflow
3. Select the resource (Student, Parent, or Group)
4. Configure the operation parameters
5. Execute your workflow

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Kinderpedia API documentation](https://openapi-documentation.kinderpedia.co/)

## Version history

- 0.1.0: Initial release with basic GET operations for Students, Parents, and Groups
