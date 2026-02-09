import 'reflect-metadata';
import express from 'express';
import request from 'supertest';
import App from '../src/app'; // Adjust path as needed
import { AppDataSource } from '../src/config/database';

async function runVerification() {
    console.log('Starting verification...');

    const appInstance = new App();
    const app = appInstance.app;

    // Initialize DB connection manually since we are not calling app.start()
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const testUser = {
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        username: `user${Date.now()}`
    };

    try {
        // 1. Register
        console.log('1. Testing Register...');
        const registerRes = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        if (registerRes.status === 201) {
            console.log('✅ Register success');
            console.log('Token:', !!registerRes.body.token);
        } else {
            console.error('❌ Register failed:', registerRes.status, registerRes.body);
        }

        // 2. Login
        console.log('\n2. Testing Login...');
        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        if (loginRes.status === 200) {
            console.log('✅ Login success');
            console.log('Token:', !!loginRes.body.token);
        } else {
            console.error('❌ Login failed:', loginRes.status, loginRes.body);
        }

        // 3. Get Current User (Protected)
        if (loginRes.body.token) {
            console.log('\n3. Testing Get Current User...');
            const meRes = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${loginRes.body.token}`);

            if (meRes.status === 200) {
                console.log('✅ Get Me success');
                console.log('User ID:', meRes.body.user.id);
            } else {
                console.error('❌ Get Me failed:', meRes.status, meRes.body);
            }
        }

        // 4. Logout
        console.log('\n4. Testing Logout...');
        const logoutRes = await request(app)
            .post('/api/v1/auth/logout');

        if (logoutRes.status === 200) {
            console.log('✅ Logout success');
        } else {
            console.error('❌ Logout failed:', logoutRes.status, logoutRes.body);
        }

    } catch (error) {
        console.error('Verification script error:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

runVerification();
