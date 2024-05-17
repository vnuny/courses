import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DBURL!);
        const connection = connect.connection;
        connection.on('connected', () => {
            console.log('MongoDB connected');
            return connect;
        })
        connection.on('error', (err) => {
            console.log(err);
            return connect;
        })
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;