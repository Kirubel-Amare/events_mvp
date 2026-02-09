import { AppDataSource } from '../src/config/database';
import request from 'supertest';
import App from '../src/app';
import { User } from '../src/models/User';

const TEST_EMAIL_ADMIN = 'admin@test.com';
const TEST_EMAIL_ORGANIZER = 'organizer@test.com';
const TEST_EMAIL_USER = 'user@test.com';
const PASSWORD = 'password123';

async function main() {
    await AppDataSource.initialize();

    const application = new App();
    const expressApp = application.app;

    // Clean up
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.query(`TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`);
    }

    console.log('Database cleaned.');

    // 1. Register Users
    console.log('Registering users...');

    // Admin
    const adminRes = await request(expressApp).post('/api/v1/auth/register').send({
        email: TEST_EMAIL_ADMIN,
        password: PASSWORD,
        confirmPassword: PASSWORD,
        name: 'Admin User',
        username: 'admin',
    }).expect(201);
    const adminToken = adminRes.body.token;

    // Make Admin (Hack for test: update DB directly)
    await AppDataSource.getRepository(User).update({ email: TEST_EMAIL_ADMIN }, { isAdmin: true });

    // Organizer
    const orgRes = await request(expressApp).post('/api/v1/auth/register').send({
        email: TEST_EMAIL_ORGANIZER,
        password: PASSWORD,
        confirmPassword: PASSWORD,
        name: 'Organizer User',
        username: 'organizer',
    }).expect(201);
    const orgToken = orgRes.body.token;

    // User
    const userRes = await request(expressApp).post('/api/v1/auth/register').send({
        email: TEST_EMAIL_USER,
        password: PASSWORD,
        confirmPassword: PASSWORD,
        name: 'Regular User',
        username: 'user',
    }).expect(201);
    const userToken = userRes.body.token;

    // 2. Organizer Profile
    console.log('Creating Organizer Profile...');
    await request(expressApp)
        .post('/api/v1/organizers/apply')
        .set('Authorization', `Bearer ${orgToken}`)
        .send({
            name: 'Super Events',
            city: 'Metropolis',
            description: 'Best events in town',
            contactInfo: 'contact@superevents.com',
        })
        .expect(201);

    // 3. Admin Verify Organizer
    console.log('Admin verifying Organizer...');
    const organizers = await request(expressApp)
        .get('/api/v1/admin/organizers/pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

    const orgId = organizers.body[0].id;
    await request(expressApp)
        .put(`/api/v1/admin/organizers/${orgId}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isVerified: true })
        .expect(200);

    // 4. Create Category (Admin)
    console.log('Creating Category...');
    const catRes = await request(expressApp)
        .post('/api/v1/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Tech', icon: 'computer' })
        .expect(201);
    const categoryId = catRes.body.id;

    // 5. Create Event (Organizer)
    console.log('Creating Event...');
    const eventRes = await request(expressApp)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${orgToken}`)
        .send({
            title: 'Tech Conference 2024',
            description: 'The biggest tech conference.',
            city: 'Metropolis',
            date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            categoryId,
        })
        .expect(201);
    const eventId = eventRes.body.event.id;

    // 6. Create Plan (User)
    console.log('Creating Plan...');
    const planRes = await request(expressApp)
        .post('/api/v1/plans')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            title: 'Conference Afterparty',
            description: 'Let us meet after the conference.',
            location: 'Downtown Bar',
            date: new Date(Date.now() + 90000000).toISOString(),
        })
        .expect(201);
    const planId = planRes.body.plan.id;

    // 7. Get Feed
    console.log('Fetching Feed...');
    const feedRes = await request(expressApp)
        .get('/api/v1/feed')
        .expect(200);

    if (feedRes.body.upcomingEvents.length === 0) throw new Error('No events in feed');
    if (feedRes.body.activePlans.length === 0) throw new Error('No plans in feed');

    // 8. User Apply to Event
    console.log('User joining Event...');
    await request(expressApp)
        .post(`/api/v1/events/${eventId}/apply`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ message: 'Can I come?' })
        .expect(201);

    // 9. Organizer joins Plan (as a user)
    console.log('Organizer joining Plan...');
    await request(expressApp)
        .post(`/api/v1/plans/${planId}/apply`)
        .set('Authorization', `Bearer ${orgToken}`)
        .send({ message: 'I am coming too!' })
        .expect(201);

    // 10. Admin Stats
    console.log('Fetching Admin Stats...');
    const statsRes = await request(expressApp)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

    console.log('Stats:', statsRes.body);

    console.log('ALL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
}

main().catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
});
