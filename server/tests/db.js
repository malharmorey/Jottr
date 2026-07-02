import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

// Boot an in-RAM MongoDB and point Mongoose at it — Atlas is never touched
export const connectTestDb = async () => {
	mongod = await MongoMemoryServer.create();
	await mongoose.connect(mongod.getUri());
	// build the declared indexes (SummaryUsage's unique {user, day} guards the quota)
	await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
};

export const clearTestDb = async () => {
	await Promise.all(
		Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({}))
	);
};

export const disconnectTestDb = async () => {
	await mongoose.disconnect();
	await mongod.stop();
};
