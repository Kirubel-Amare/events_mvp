import { AppDataSource } from '../../config/database';
import { initializeDatabase } from '../connection';
import { Category } from '../../models/Category';
import { User } from '../../models/User';
import { PersonalProfile } from '../../models/PersonalProfile';
import { OrganizerProfile } from '../../models/OrganizerProfile';
import { Event, EventStatus } from '../../models/Event';
import { Plan, PlanStatus } from '../../models/Plan';
import { Helpers } from '../../utils/helpers';

async function runSeeders() {
  try {
    await initializeDatabase();
    console.log('Database connection initialized for seeding');

    // 1. Seed Categories
    const categoryRepository = AppDataSource.getRepository(Category);
    const defaultCategories = [
      { name: 'Music', icon: '🎵' },
      { name: 'Sports', icon: '⚽' },
      { name: 'Art', icon: '🎨' },
      { name: 'Food', icon: '🍕' },
      { name: 'Tech', icon: '💻' },
      { name: 'Wellness', icon: '🧘' },
      { name: 'Business', icon: '💼' },
      { name: 'Social', icon: '👥' },
      { name: 'Education', icon: '📚' },
      { name: 'Outdoor', icon: '🌳' },
    ];

    const categoryMap: Record<string, Category> = {};
    for (const categoryData of defaultCategories) {
      let category = await categoryRepository.findOneBy({ name: categoryData.name });
      if (!category) {
        category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
      }
      categoryMap[category.name] = category;
    }
    console.log('Categories seeded');

    // 2. Seed Users
    const userRepository = AppDataSource.getRepository(User);
    const personalProfileRepository = AppDataSource.getRepository(PersonalProfile);
    const organizerProfileRepository = AppDataSource.getRepository(OrganizerProfile);

    const passwordHash = await Helpers.hashPassword('password123');

    // Admin
    let admin = await userRepository.findOneBy({ email: 'admin@eventhub.com' });
    if (!admin) {
      admin = userRepository.create({
        email: 'admin@eventhub.com',
        passwordHash,
        isAdmin: true,
        isEmailVerified: true
      });
      await userRepository.save(admin);
      const profile = personalProfileRepository.create({
        name: 'System Admin',
        username: 'admin',
        city: 'Addis Ababa',
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        user: admin
      });
      await personalProfileRepository.save(profile);
    }

    // Organizer
    let organizerUser = await userRepository.findOneBy({ email: 'organizer@eventhub.com' });
    if (!organizerUser) {
      organizerUser = userRepository.create({
        email: 'organizer@eventhub.com',
        passwordHash,
        isOrganizer: true,
        isEmailVerified: true
      });
      await userRepository.save(organizerUser);

      const pProfile = personalProfileRepository.create({
        name: 'Organizer Primary',
        username: 'organizer',
        city: 'Addis Ababa',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        user: organizerUser
      });
      await personalProfileRepository.save(pProfile);

      const oProfile = organizerProfileRepository.create({
        organizationName: 'City Events',
        description: 'Best event organizer in the city',
        city: 'Addis Ababa',
        contactInfo: 'contact@cityevents.com',
        profilePhoto: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop',
        isVerified: true,
        isActive: true,
        user: organizerUser
      });
      await organizerProfileRepository.save(oProfile);
    }
    const organizerProfile = await organizerProfileRepository.findOneBy({ userId: organizerUser.id });

    // Regular User
    let regularUser = await userRepository.findOneBy({ email: 'user@eventhub.com' });
    if (!regularUser) {
      regularUser = userRepository.create({
        email: 'user@eventhub.com',
        passwordHash,
        isEmailVerified: true
      });
      await userRepository.save(regularUser);

      const pProfile = personalProfileRepository.create({
        name: 'Alex User',
        username: 'alex',
        city: 'Addis Ababa',
        profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        user: regularUser
      });
      await personalProfileRepository.save(pProfile);
    }
    console.log('Users and Profiles seeded');

    // 3. Seed Events
    const eventRepository = AppDataSource.getRepository(Event);
    const mockEvents = [
      {
        title: "Summer Music Festival",
        description: "Join us for a day of live music, food, and fun! Featuring standard local artists and great vibes.",
        date: new Date('2024-07-15T12:00:00'),
        city: "Central Park, NY",
        images: ["https://images.unsplash.com/photo-1533174072545-e8d4aa97d848?auto=format&fit=crop&q=80&w=1000"],
        categoryName: "Music",
        isFeatured: true,
        price: "25.0",
        capacity: 500,
        status: EventStatus.APPROVED
      },
      {
        title: "Tech Startup Mixer",
        description: "Network with founders, investors, and developers in the local tech scene.",
        date: new Date('2024-06-20T18:00:00'),
        city: "Innovation Hub",
        images: ["https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000"],
        categoryName: "Tech",
        isFeatured: false,
        price: "0",
        capacity: 100,
        status: EventStatus.APPROVED
      },
      {
        title: "Art Gallery Opening",
        description: "Experience modern art from upcoming artists.",
        date: new Date('2024-06-25T19:00:00'),
        city: "The Gallery",
        images: ["https://images.unsplash.com/photo-1518998053901-5348d3969104?auto=format&fit=crop&q=80&w=1000"],
        categoryName: "Art",
        isFeatured: true,
        price: "15.0",
        capacity: 150,
        status: EventStatus.APPROVED
      }
    ];

    if (organizerProfile) {
      for (const eventData of mockEvents) {
        const { categoryName, ...rest } = eventData;
        const exists = await eventRepository.findOneBy({ title: rest.title });
        if (!exists) {
          const event = eventRepository.create({
            ...rest,
            organizer: organizerProfile,
            category: categoryMap[categoryName] || null
          });
          await eventRepository.save(event);
        }
      }
    }
    console.log('Events seeded');

    // 4. Seed Plans
    const planRepository = AppDataSource.getRepository(Plan);
    const mockPlans = [
      {
        title: "Weekend Hiking Trip",
        description: "Planning to go hiking this weekend. Looking for company!",
        date: new Date('2024-06-22T08:00:00'),
        location: "Blue Mountain",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Coffee & Coding",
        description: "Let's meet up and code together at a query coffee shop.",
        date: new Date('2024-06-23T10:00:00'),
        location: "Brew Café",
        status: PlanStatus.ACTIVE
      }
    ];

    if (regularUser) {
      for (const planData of mockPlans) {
        const exists = await planRepository.findOneBy({ title: planData.title });
        if (!exists) {
          const plan = planRepository.create({
            ...planData,
            creator: regularUser
          });
          await planRepository.save(plan);
        }
      }
    }
    console.log('Plans seeded');

    console.log('Seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();