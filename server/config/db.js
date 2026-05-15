import mongoose from 'mongoose';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
dns.setServers([process.env.IP_ADDRESS_ONE, process.env.IP_ADDRESS_TWO]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to Database:', error);
        process.exit(1);
    }
};

export default connectDB; 