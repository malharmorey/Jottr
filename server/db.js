import mongoose from 'mongoose';
const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.4ggiqdc.mongodb.net/${process.env.MONGO_DBNAME}`;

const connectToMongo = () => {
	mongoose
		.connect(mongoURI)
		.then(() => {
			console.log('Successfully connected to mongoDB');
		})
		.catch((err) => console.error(err));
};

export default connectToMongo;
