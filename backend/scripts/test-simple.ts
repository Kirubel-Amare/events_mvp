import { AppDataSource } from '../src/config/database';
import request from 'supertest';
import App from '../src/app';

async function main() {
    console.log('Script started');
    try {
        console.log('Initializing DB...');
        await AppDataSource.initialize();
        console.log('DB initialized');

        const application = new App();
        const expressApp = application.app;
        console.log('App ready');

        const res = await request(expressApp).get('/api/v1/feed');
        console.log('Feed res status:', res.status);

        console.log('SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error('ERROR during verification:', err);
        process.exit(1);
    }
}

main();
