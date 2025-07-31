import { connectSQL } from './connectionToSQL.js';
import bcrypt from 'bcrypt';

async function seedDatabase() {
    const connection = await connectSQL();

    try {
        // Clear existing data
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
        await connection.execute('TRUNCATE TABLE Registrations;');
        await connection.execute('TRUNCATE TABLE Events;');
        await connection.execute('TRUNCATE TABLE Users;');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');

        // Seed Users
        const hashedPassword = await bcrypt.hash('password123', 10);
        const users = [
            { name: 'Admin One', email: 'admin1@example.com', role: 'admin' },
            { name: 'Admin Two', email: 'admin2@example.com', role: 'admin' },
            { name: 'Student One', email: 'student1@example.com', role: 'student' },
            { name: 'Student Two', email: 'student2@example.com', role: 'student' },
            { name: 'Student Three', email: 'student3@example.com', role: 'student' },
            { name: 'Student Four', email: 'student4@example.com', role: 'student' },
            { name: 'Student Five', email: 'student5@example.com', role: 'student' },
        ];

        for (const user of users) {
            await connection.execute(
                'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [user.name, user.email, hashedPassword, user.role]
            );
        }

        // Fetch user IDs
        const [userRows] = await connection.execute('SELECT id, role FROM Users');
        const adminIds = userRows.filter(u => u.role === 'admin').map(u => u.id);
        const studentIds = userRows.filter(u => u.role === 'student').map(u => u.id);

        // Seed Events
        const events = [
            { title: 'Tech Fest 2025', description: 'Annual tech symposium', date: '2025-08-10 10:00:00', location: 'Auditorium', category: 'tech', status: 'approved', created_by: adminIds[0] },
            { title: 'Cultural Night', description: 'Celebration of college culture', date: '2025-09-15 18:00:00', location: 'Open Grounds', category: 'cultural', status: 'approved', created_by: adminIds[0] },
            { title: 'Hackathon', description: '24-hour coding competition', date: '2025-10-01 09:00:00', location: 'Lab 1', category: 'tech', status: 'pending', created_by: adminIds[1] },
            { title: 'Sports Day', description: 'Annual sports event', date: '2025-11-05 08:00:00', location: 'Sports Field', category: 'sports', status: 'approved', created_by: adminIds[0] },
            { title: 'Workshop: AI', description: 'Intro to AI', date: '2025-08-20 14:00:00', location: 'Seminar Hall', category: 'tech', status: 'approved', created_by: adminIds[1] },
            { title: 'Music Concert', description: 'Live music performance', date: '2025-09-25 19:00:00', location: 'Amphitheater', category: 'cultural', status: 'rejected', created_by: adminIds[0] },
            { title: 'Career Fair', description: 'Job opportunities for students', date: '2025-10-10 10:00:00', location: 'Main Hall', category: 'career', status: 'approved', created_by: adminIds[1] },
            { title: 'Art Exhibition', description: 'Showcase of student art', date: '2025-11-15 11:00:00', location: 'Gallery', category: 'cultural', status: 'pending', created_by: adminIds[0] },
            { title: 'Robotics Workshop', description: 'Build your own robot', date: '2025-08-30 09:00:00', location: 'Lab 2', category: 'tech', status: 'approved', created_by: adminIds[1] },
            { title: 'Charity Run', description: 'Run for a cause', date: '2025-12-01 07:00:00', location: 'Campus Track', category: 'sports', status: 'approved', created_by: adminIds[0] },
        ];

        for (const event of events) {
            await connection.execute(
                'INSERT INTO Events (title, description, date, location, category, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [event.title, event.description, event.date, event.location, event.category, event.status, event.created_by]
            );
        }

        // Fetch event IDs
        const [eventRows] = await connection.execute('SELECT id FROM Events');
        const eventIds = eventRows.map(e => e.id);

        // Seed Registrations
        const registrations = [
            { user_id: studentIds[0], event_id: eventIds[0], registration_date: '2025-07-25 10:00:00' },
            { user_id: studentIds[0], event_id: eventIds[1], registration_date: '2025-07-25 10:05:00' },
            { user_id: studentIds[1], event_id: eventIds[0], registration_date: '2025-07-25 11:00:00' },
            { user_id: studentIds[1], event_id: eventIds[3], registration_date: '2025-07-26 09:00:00' },
            { user_id: studentIds[2], event_id: eventIds[0], registration_date: '2025-07-26 10:00:00' },
            { user_id: studentIds[2], event_id: eventIds[4], registration_date: '2025-07-26 12:00:00' },
            { user_id: studentIds[3], event_id: eventIds[1], registration_date: '2025-07-27 08:00:00' },
            { user_id: studentIds[3], event_id: eventIds[6], registration_date: '2025-07-27 09:00:00' },
            { user_id: studentIds[4], event_id: eventIds[0], registration_date: '2025-07-27 10:00:00' },
            { user_id: studentIds[4], event_id: eventIds[3], registration_date: '2025-07-27 11:00:00' },
            { user_id: studentIds[0], event_id: eventIds[6], registration_date: '2025-07-28 09:00:00' },
            { user_id: studentIds[1], event_id: eventIds[4], registration_date: '2025-07-28 10:00:00' },
            { user_id: studentIds[2], event_id: eventIds[1], registration_date: '2025-07-28 11:00:00' },
            { user_id: studentIds[3], event_id: eventIds[0], registration_date: '2025-07-28 12:00:00' },
            { user_id: studentIds[4], event_id: eventIds[4], registration_date: '2025-07-28 13:00:00' },
            { user_id: studentIds[0], event_id: eventIds[3], registration_date: '2025-07-29 08:00:00' },
            { user_id: studentIds[1], event_id: eventIds[1], registration_date: '2025-07-29 09:00:00' },
            { user_id: studentIds[2], event_id: eventIds[6], registration_date: '2025-07-29 10:00:00' },
            { user_id: studentIds[3], event_id: eventIds[3], registration_date: '2025-07-29 11:00:00' },
            { user_id: studentIds[4], event_id: eventIds[1], registration_date: '2025-07-29 12:00:00' },
        ];

        for (const reg of registrations) {
            await connection.execute(
                'INSERT INTO Registrations (user_id, event_id, registration_date) VALUES (?, ?, ?)',
                [reg.user_id, reg.event_id, reg.registration_date]
            );
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await connection.end();
    }
}

export { seedDatabase };