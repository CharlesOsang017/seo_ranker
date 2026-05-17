import mongoose from 'mongoose';
import dns from 'dns';

// Only apply DNS workarounds in local environment to avoid breaking Vercel DNS
if (!process.env.VERCEL) {
    try {
        dns.setDefaultResultOrder('ipv4first');
        if (process.env.IP_ADDRESS_ONE && process.env.IP_ADDRESS_TWO) {
            dns.setServers([process.env.IP_ADDRESS_ONE, process.env.IP_ADDRESS_TWO]);
        }
    } catch (e) {
        console.warn('Could not set custom DNS servers', e.message);
    }
}

// Track connection state for serverless environments
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to Database:', error);
        if (!process.env.VERCEL) {
            process.exit(1);
        } else {
            throw error;
        }
    }
};

export default connectDB; 