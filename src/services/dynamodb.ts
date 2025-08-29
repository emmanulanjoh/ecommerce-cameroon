import { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, AWS_CONFIG } from '../config/aws';

const TABLE_NAME = AWS_CONFIG.DYNAMODB_TABLE;

export class DynamoDBService {
  // Create item
  static async create(item: any) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    await docClient.send(command);
    return item;
  }

  // Get item by PK and SK
  static async get(pk: string, sk: string) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    });
    const result = await docClient.send(command);
    return result.Item;
  }

  // Query items by PK
  static async query(pk: string, skPrefix?: string) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: skPrefix 
        ? 'PK = :pk AND begins_with(SK, :sk)'
        : 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
        ...(skPrefix && { ':sk': skPrefix }),
      },
    });
    const result = await docClient.send(command);
    return result.Items || [];
  }

  // Update item
  static async update(pk: string, sk: string, updates: any) {
    const updateExpression = Object.keys(updates)
      .map(key => `#${key} = :${key}`)
      .join(', ');
    
    const expressionAttributeNames = Object.keys(updates)
      .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
    
    const expressionAttributeValues = Object.keys(updates)
      .reduce((acc, key) => ({ ...acc, [`:${key}`]: updates[key] }), {});

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `SET ${updateExpression}, updatedAt = :updatedAt`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    });
    
    const result = await docClient.send(command);
    return result.Attributes;
  }

  // Delete item
  static async delete(pk: string, sk: string) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    });
    await docClient.send(command);
  }

  // Scan all items
  static async scanAll() {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
      });
      const result = await docClient.send(command);
      return result.Items || [];
    } catch (error) {
      console.error('DynamoDB scan error:', error);
      throw error;
    }
  }

  // Query GSI
  static async queryGSI(gsi1pk: string) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': gsi1pk,
      },
    });
    const result = await docClient.send(command);
    return result.Items || [];
  }
}