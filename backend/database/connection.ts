import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let database: Db | null = null;

export const connect_to_mongodb = async (): Promise<Db> => {
  if (database) {
    return database;
  }

  const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const database_name = process.env.DATABASE_NAME || 'app_database';

  try {
    client = new MongoClient(mongodb_uri);
    await client.connect();
    database = client.db(database_name);
    return database;
  } catch (error) {
    // Log error for debugging purposes without exposing sensitive details
    console.error('MongoDB connection failed. Check database configuration.', {
      timestamp: new Date().toISOString(),
      error_type: error instanceof Error ? error.constructor.name : 'Unknown',
      error_code: error instanceof Error && 'code' in error ? (error as any).code : 'UNKNOWN'
    });
    
    // Throw sanitized error that doesn't expose sensitive connection details
    throw new Error('Failed to connect to database. Please check your database configuration.');
  }
};

export const get_database = (): Db => {
  if (!database) {
    throw new Error('Database not connected. Call connect_to_mongodb first.');
  }
  return database;
};

export const close_connection = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}; 