require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    let retries = 5;
    
    while (retries > 0) {
        const connected = await testConnection();
        
        if (connected) {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
                console.log(`API available at http://localhost:${PORT}/api/tasks`);
            });
            break;
        }
        
        retries -= 1;
        console.log(`Retrying database connection... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    if (retries === 0) {
        console.error('Could not connect to database after multiple attempts');
        process.exit(1);
    }
};

startServer();