/**
 * Database Seed Script
 * Populates the database with demo data for testing and demonstration.
 *
 * Run: npx ts-node-dev src/seed.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.model';
import Bus from './models/bus.model';
import Student from './models/student.model';
import BusAssignment from './models/busAssignment.model';
import Route from './models/route.model';
import Alert from './models/alert.model';
import Attendance from './models/attendance.model';
import Tracking from './models/tracking.model';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-bus-db';

// ── Demo Locations (New York City area) ──
const SCHOOL_LOCATION = { lat: 40.7580, lng: -73.9855, address: 'Central School, Midtown Manhattan' };

const STUDENT_LOCATIONS = [
  { lat: 40.7484, lng: -73.9857, address: '123 Empire State Ave' },
  { lat: 40.7614, lng: -73.9776, address: '456 Rockefeller Plaza' },
  { lat: 40.7527, lng: -73.9772, address: '789 Grand Central Way' },
  { lat: 40.7282, lng: -73.7949, address: '321 Queens Blvd, Queens' },
  { lat: 40.7589, lng: -73.9851, address: '654 Times Square West' },
  { lat: 40.7061, lng: -74.0087, address: '111 Wall Street' },
  { lat: 40.7128, lng: -74.0060, address: '222 Broadway, Lower Manhattan' },
  { lat: 40.7411, lng: -73.9897, address: '333 Madison Square' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Clear existing data ──
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Bus.deleteMany({});
    await Student.deleteMany({});
    await BusAssignment.deleteMany({});
    await Route.deleteMany({});
    await Alert.deleteMany({});
    await Attendance.deleteMany({});
    await Tracking.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 12);

    // ── Create Admin User ──
    console.log('👤 Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@schoolbus.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    // ── Create Drivers ──
    const driver1 = await User.create({
      name: 'John Driver',
      email: 'driver1@schoolbus.com',
      password: hashedPassword,
      role: 'DRIVER'
    });

    const driver2 = await User.create({
      name: 'Sarah Driver',
      email: 'driver2@schoolbus.com',
      password: hashedPassword,
      role: 'DRIVER'
    });

    // ── Create Parents ──
    const parent1 = await User.create({ name: 'Alice Parent', email: 'parent1@schoolbus.com', password: hashedPassword, role: 'PARENT' });
    const parent2 = await User.create({ name: 'Bob Parent', email: 'parent2@schoolbus.com', password: hashedPassword, role: 'PARENT' });
    const parent3 = await User.create({ name: 'Carol Parent', email: 'parent3@schoolbus.com', password: hashedPassword, role: 'PARENT' });
    const parent4 = await User.create({ name: 'David Parent', email: 'parent4@schoolbus.com', password: hashedPassword, role: 'PARENT' });
    const parent5 = await User.create({ name: 'Eve Parent', email: 'parent5@schoolbus.com', password: hashedPassword, role: 'PARENT' });
    const parent6 = await User.create({ name: 'Frank Parent', email: 'parent6@schoolbus.com', password: hashedPassword, role: 'PARENT' });
    const parent7 = await User.create({ name: 'Grace Parent', email: 'parent7@schoolbus.com', password: hashedPassword, role: 'PARENT' });
    const parent8 = await User.create({ name: 'Henry Parent', email: 'parent8@schoolbus.com', password: hashedPassword, role: 'PARENT' });

    console.log(`   ✅ Created 11 users (1 admin, 2 drivers, 8 parents)`);

    // ── Create Buses ──
    console.log('🚌 Creating buses...');
    const bus1 = await Bus.create({
      registrationNumber: 'BUS-001',
      capacity: 5,
      driverId: driver1._id,
      status: 'active'
    });

    const bus2 = await Bus.create({
      registrationNumber: 'BUS-002',
      capacity: 4,
      driverId: driver2._id,
      status: 'active'
    });

    const bus3 = await Bus.create({
      registrationNumber: 'BUS-003',
      capacity: 6,
      status: 'maintenance'
    });

    console.log(`   ✅ Created 3 buses`);

    // ── Create Students (linked to parents with real locations) ──
    console.log('🎒 Creating students...');
    const student1 = await Student.create({
      name: 'Emma Smith',
      email: 'emma@student.com',
      parentId: parent1._id,
      location: STUDENT_LOCATIONS[0],
      grade: '5th'
    });

    const student2 = await Student.create({
      name: 'Liam Johnson',
      email: 'liam@student.com',
      parentId: parent5._id,
      location: STUDENT_LOCATIONS[1],
      grade: '3rd'
    });

    const student3 = await Student.create({
      name: 'Olivia Williams',
      email: 'olivia@student.com',
      parentId: parent2._id,
      location: STUDENT_LOCATIONS[2],
      grade: '4th'
    });

    const student4 = await Student.create({
      name: 'Noah Brown',
      email: 'noah@student.com',
      parentId: parent6._id,
      location: STUDENT_LOCATIONS[3],
      grade: '6th'
    });

    const student5 = await Student.create({
      name: 'Sophia Davis',
      email: 'sophia@student.com',
      parentId: parent3._id,
      location: STUDENT_LOCATIONS[4],
      grade: '2nd'
    });

    const student6 = await Student.create({
      name: 'Mason Wilson',
      email: 'mason@student.com',
      parentId: parent7._id,
      location: STUDENT_LOCATIONS[5],
      grade: '5th'
    });

    const student7 = await Student.create({
      name: 'Isabella Taylor',
      email: 'isabella@student.com',
      parentId: parent4._id,
      location: STUDENT_LOCATIONS[6],
      grade: '4th'
    });

    const student8 = await Student.create({
      name: 'Ethan Martinez',
      email: 'ethan@student.com',
      parentId: parent8._id,
      location: STUDENT_LOCATIONS[7],
      grade: '3rd'
    });

    console.log(`   ✅ Created 8 students`);

    // ── Assign Students to Buses ──
    console.log('🔗 Assigning students to buses...');
    // Bus 1: 5 students (capacity 5)
    await BusAssignment.insertMany([
      { studentId: student1._id, busId: bus1._id },
      { studentId: student2._id, busId: bus1._id },
      { studentId: student3._id, busId: bus1._id },
      { studentId: student5._id, busId: bus1._id },
      { studentId: student7._id, busId: bus1._id },
    ]);

    // Bus 2: 3 students (capacity 4)
    await BusAssignment.insertMany([
      { studentId: student4._id, busId: bus2._id },
      { studentId: student6._id, busId: bus2._id },
      { studentId: student8._id, busId: bus2._id },
    ]);

    console.log(`   ✅ Assigned 5 students to BUS-001, 3 to BUS-002`);

    // ── Create Attendance Records (today) ──
    console.log('📋 Creating attendance records...');
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    await Attendance.insertMany([
      { studentId: student1._id, status: 'PRESENT', date: startOfDay },
      { studentId: student2._id, status: 'PRESENT', date: startOfDay },
      { studentId: student3._id, status: 'PRESENT', date: startOfDay },
      { studentId: student4._id, status: 'ABSENT', date: startOfDay },
      { studentId: student5._id, status: 'PRESENT', date: startOfDay },
      { studentId: student6._id, status: 'PRESENT', date: startOfDay },
      { studentId: student7._id, status: 'PRESENT', date: startOfDay },
      { studentId: student8._id, status: 'PRESENT', date: startOfDay },
    ]);
    console.log(`   ✅ Created 8 attendance records (1 absent)`);

    // ── Create Routes with realistic stops ──
    console.log('🗺️  Creating optimized routes...');
    await Route.create({
      name: 'Morning Route - Bus 001',
      busId: bus1._id,
      stops: [
        { stopName: 'Emma Smith', location: STUDENT_LOCATIONS[0], pickupTimeWindow: { start: '07:00', end: '07:05' } },
        { stopName: 'Liam Johnson', location: STUDENT_LOCATIONS[1], pickupTimeWindow: { start: '07:08', end: '07:13' } },
        { stopName: 'Olivia Williams', location: STUDENT_LOCATIONS[2], pickupTimeWindow: { start: '07:16', end: '07:21' } },
        { stopName: 'Sophia Davis', location: STUDENT_LOCATIONS[4], pickupTimeWindow: { start: '07:25', end: '07:30' } },
        { stopName: 'Isabella Taylor', location: STUDENT_LOCATIONS[6], pickupTimeWindow: { start: '07:35', end: '07:40' } },
      ]
    });

    await Route.create({
      name: 'Morning Route - Bus 002',
      busId: bus2._id,
      stops: [
        { stopName: 'Mason Wilson', location: STUDENT_LOCATIONS[5], pickupTimeWindow: { start: '07:00', end: '07:05' } },
        { stopName: 'Ethan Martinez', location: STUDENT_LOCATIONS[7], pickupTimeWindow: { start: '07:10', end: '07:15' } },
      ]
    });
    console.log(`   ✅ Created 2 routes`);

    // ── Create Tracking Data ──
    console.log('📍 Creating tracking data...');
    await Tracking.create({
      busId: bus1._id,
      lat: 40.7484,
      lng: -73.9857
    });

    await Tracking.create({
      busId: bus2._id,
      lat: 40.7061,
      lng: -74.0087
    });
    console.log(`   ✅ Created initial GPS positions`);

    // ── Create Alerts ──
    console.log('🚨 Creating system alerts...');
    await Alert.insertMany([
      { type: 'DELAY', message: 'BUS-001 is running 5 mins late due to traffic on 5th Ave.', busId: bus1._id, severity: 'medium' },
      { type: 'INFO', message: 'New nearest-neighbor optimization applied to South Route.', severity: 'low' },
      { type: 'OFF_ROUTE', message: 'BUS-002 deviated 0.3km from planned route near Queens Blvd.', busId: bus2._id, severity: 'high' },
    ]);
    console.log(`   ✅ Created 3 alerts`);

    // ── Print Summary ──
    console.log('\n' + '═'.repeat(55));
    console.log('  🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═'.repeat(55));
    console.log('\n📝 Login Credentials (password: password123):\n');
    console.log('  🔑 Admin:   admin@schoolbus.com');
    console.log('  🔑 Driver1: driver1@schoolbus.com');
    console.log('  🔑 Driver2: driver2@schoolbus.com');
    console.log('  🔑 Parent1: parent1@schoolbus.com');
    console.log('  🔑 Parent2: parent2@schoolbus.com');
    console.log('  🔑 Parent3: parent3@schoolbus.com');
    console.log('  🔑 Parent4: parent4@schoolbus.com');
    console.log('  🔑 Parent5: parent5@schoolbus.com');
    console.log('  🔑 Parent6: parent6@schoolbus.com');
    console.log('  🔑 Parent7: parent7@schoolbus.com');
    console.log('  🔑 Parent8: parent8@schoolbus.com');
    console.log('\n📊 Data Summary:');
    console.log(`  • 11 Users  •  3 Buses  •  8 Students`);
    console.log(`  • 8 Attendance  •  2 Routes  •  3 Alerts`);
    console.log(`\n  Bus 1 ID: ${bus1._id}`);
    console.log(`  Bus 2 ID: ${bus2._id}`);
    console.log();

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
