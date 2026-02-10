console.log('DEBUG: Imports starting...');
import { AppDataSource } from '../src/config/database';
console.log('DEBUG: AppDataSource imported');
import request from 'supertest';
import App from '../src/app';
console.log('DEBUG: App imported');
import { User, UserRole } from '../src/models/User';
console.log('DEBUG: User model imported');

const SUFFIX = Math.random().toString(36).substring(7);
const TEST_EMAIL_USER = `app${SUFFIX}@test.com`;
const TEST_EMAIL_ADMIN = `adm${SUFFIX}@test.com`;
const PASSWORD = 'password123';

async function main() {
    console.log('Starting Organizer Application Flow verification...');

    await AppDataSource.initialize();
    const application = new App();
    const expressApp = application.app;

    // 1. Setup Admin
    console.log('Setting up admin...');
    const regAdminRes = await request(expressApp).post('/api/v1/auth/register').send({
        email: TEST_EMAIL_ADMIN,
        password: PASSWORD,
        name: 'Admin User',
        username: `adm${SUFFIX}`,
    });
    if (regAdminRes.status !== 201) {
        console.log('Admin register failed:', regAdminRes.status, regAdminRes.body);
    }
    await AppDataSource.getRepository(User).update({ email: TEST_EMAIL_ADMIN }, { isAdmin: true, role: UserRole.ADMIN });

    const adminLogin = await request(expressApp).post('/api/v1/auth/login').send({
        email: TEST_EMAIL_ADMIN,
        password: PASSWORD,
    });
    const adminToken = adminLogin.body.token;

    // 2. Setup User
    console.log('Setting up applicant user...');
    const regUserRes = await request(expressApp).post('/api/v1/auth/register').send({
        email: TEST_EMAIL_USER,
        password: PASSWORD,
        name: 'Applicant User',
        username: `app${SUFFIX}`,
    });
    if (regUserRes.status !== 201) {
        console.log('User register failed:', regUserRes.status, regUserRes.body);
    }

    const userLogin = await request(expressApp).post('/api/v1/auth/login').send({
        email: TEST_EMAIL_USER,
        password: PASSWORD,
    });
    const userToken = userLogin.body.token;

    // 3. User Applies
    console.log('User applying to become organizer...');
    const applyRes = await request(expressApp)
        .post('/api/v1/organizers/apply')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            organizationName: 'Testing Org',
            reason: 'I want to host tech meetups for developers.',
        });

    if (applyRes.status !== 201) {
        console.error('Failed to apply:', applyRes.body);
        process.exit(1);
    }
    const applicationId = applyRes.body.application.id;
    console.log('Application submitted ID:', applicationId);

    // 4. Admin Approves
    console.log('Admin approving application...');
    const approveRes = await request(expressApp)
        .post(`/api/v1/admin/organizers/applications/${applicationId}/handle`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            status: 'approved',
            adminComment: 'Looks good, welcome aboard!',
        });

    if (approveRes.status !== 200) {
        console.error('Failed to approve:', approveRes.body);
        process.exit(1);
    }
    console.log('Application approved!');

    // 5. Verify User Status
    console.log('Verifying user status...');
    const verifyUser = await AppDataSource.getRepository(User).findOne({ where: { email: TEST_EMAIL_USER } });
    if (verifyUser?.role === UserRole.ORGANIZER && verifyUser?.isOrganizer === true) {
        console.log('SUCCESS: User is now an ORGANIZER!');
    } else {
        console.error('FAILED: User role or isOrganizer flag not updated correctly.', verifyUser);
        process.exit(1);
    }

    console.log('Verification finished successfully.');
    process.exit(0);
}

main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
