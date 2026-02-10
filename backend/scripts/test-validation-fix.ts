import { AppDataSource } from '../src/config/database';
import request from 'supertest';
import App from '../src/app';
import { User } from '../src/models/User';

const TEST_EMAIL = 'val_test@test.com';
const PASSWORD = 'password123';

async function main() {
    console.log('Starting validation fix verification...');

    await AppDataSource.initialize();
    const application = new App();
    const expressApp = application.app;

    // 1. Register/Login
    console.log('Registering test user...');
    const regRes = await request(expressApp).post('/api/v1/auth/register').send({
        email: TEST_EMAIL,
        password: PASSWORD,
        confirmPassword: PASSWORD,
        name: 'Validation Test User',
        username: 'valtest',
    });

    let token;
    if (regRes.status === 201) {
        token = regRes.body.token;
    } else {
        // Try login instead if already exists
        const loginRes = await request(expressApp).post('/api/v1/auth/login').send({
            email: TEST_EMAIL,
            password: PASSWORD,
        });
        token = loginRes.body.token;
    }

    // 2. Test createPlan with empty externalLink
    console.log('Testing createPlan with empty externalLink...');
    const planRes = await request(expressApp)
        .post('/api/v1/plans')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Test Plan with Empty Link',
            description: 'This is a test plan description that is long enough.',
            location: 'Test Location',
            date: new Date(Date.now() + 86400000).toISOString(),
            externalLink: "", // The problematic field
        });

    if (planRes.status === 201) {
        console.log('SUCCESS: Plan created with empty externalLink!');
        console.log('Saved data:', planRes.body.plan);
        if (planRes.body.plan.externalLink === null) {
            console.log('SUCCESS: externalLink was converted to null.');
        } else {
            console.log('WARNING: externalLink was NOT converted to null, but create succeeded.');
        }
    } else {
        console.error('FAILED: createPlan failed with status', planRes.status);
        console.error('Errors:', JSON.stringify(planRes.body, null, 2));
        process.exit(1);
    }

    console.log('Verification finished gracefully.');
    process.exit(0);
}

main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
