/**
 * MongoDB Database Connection Configuration
 * Establishes connection to MongoDB Atlas using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
