import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-explorer';
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  client = new MongoClient(uri);
  await client.connect();
  
  db = client.db();
  console.log('Connected to MongoDB');
  
  return db;
}

export async function getCollection(name: string): Promise<Collection> {
  const database = await connectToDatabase();
  return database.collection(name);
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});