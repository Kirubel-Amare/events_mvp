import { AppDataSource } from '../../config/database';
import { initializeDatabase } from '../connection';
import { Category } from '../../models/Category';
import { User, UserRole } from '../../models/User';
import { PersonalProfile } from '../../models/PersonalProfile';
import { OrganizerProfile } from '../../models/OrganizerProfile';
import { Event, EventStatus } from '../../models/Event';
import { Plan, PlanStatus } from '../../models/Plan';
import { Notification, NotificationType } from '../../models/Notification';
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
        role: UserRole.ADMIN,
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
    } else if (admin.role !== UserRole.ADMIN) {
      admin.role = UserRole.ADMIN;
      admin.isAdmin = true;
      await userRepository.save(admin);
    }

    // Organizer
    let organizerUser = await userRepository.findOneBy({ email: 'organizer@eventhub.com' });
    if (!organizerUser) {
      organizerUser = userRepository.create({
        email: 'organizer@eventhub.com',
        passwordHash,
        isOrganizer: true,
        role: UserRole.ORGANIZER,
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
    } else if (organizerUser.role !== UserRole.ORGANIZER) {
      organizerUser.role = UserRole.ORGANIZER;
      organizerUser.isOrganizer = true;
      await userRepository.save(organizerUser);
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
        description: "Join us for a day of live music, food, and fun! Featuring local artists and great vibes.",
        date: new Date('2024-07-15T12:00:00'),
        city: "Central Park, NY",
        images: ["https://images.unsplash.com/photo-1459749411177-042180ce673c?w=1200&auto=format&fit=crop"],
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
        images: ["https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop"],
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
        images: ["https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&auto=format&fit=crop"],
        categoryName: "Art",
        isFeatured: true,
        price: "15.0",
        capacity: 150,
        status: EventStatus.APPROVED
      },
      {
        title: "Global Food Expo 2024",
        description: "Taste dishes from over 50 countries in one location!",
        date: new Date('2024-08-10T11:00:00'),
        city: "Addis Ababa",
        images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop"],
        categoryName: "Food",
        isFeatured: true,
        price: "30.0",
        capacity: 1000,
        status: EventStatus.APPROVED
      },
      {
        title: "Yoga Flow in the Park",
        description: "Refresh your mind and body with a morning yoga session in Nature.",
        date: new Date('2024-06-15T07:30:00'),
        city: "Addis Ababa",
        images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop"],
        categoryName: "Wellness",
        isFeatured: false,
        price: "0",
        capacity: 50,
        status: EventStatus.APPROVED
      },
      {
        title: "Entrepreneur Summit",
        description: "Learn from industry leaders and grow your business network.",
        date: new Date('2024-09-05T09:00:00'),
        city: "Addis Ababa",
        images: ["https://images.unsplash.com/photo-1507679799987-c7377ec48696?w=1200&auto=format&fit=crop"],
        categoryName: "Business",
        isFeatured: true,
        price: "150.0",
        capacity: 300,
        status: EventStatus.APPROVED
      },
      {
        title: "Basketball Championship",
        description: "Watch local teams compete for the city trophy.",
        date: new Date('2024-07-20T16:00:00'),
        city: "Stadium Addis",
        images: ["https://images.unsplash.com/photo-1504450758481-7338ef752242?w=1200&auto=format&fit=crop"],
        categoryName: "Sports",
        isFeatured: false,
        price: "10.0",
        capacity: 5000,
        status: EventStatus.APPROVED
      },
      {
        title: "Nature Photography Workshop",
        description: "Master the art of outdoor photography with professional guidance.",
        date: new Date('2024-08-22T14:00:00'),
        city: "Unity Park",
        images: ["https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop"],
        categoryName: "Education",
        isFeatured: false,
        price: "45.0",
        capacity: 20,
        status: EventStatus.APPROVED
      },
      {
        title: "Charity Gala Night",
        description: "An evening of elegance supporting local educational initiatives.",
        date: new Date('2024-10-12T19:00:00'),
        city: "Grand Hotel",
        images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop"],
        categoryName: "Social",
        isFeatured: true,
        price: "100.0",
        capacity: 200,
        status: EventStatus.APPROVED
      },
      {
        title: "Night Sky Exploration",
        description: "Observe stars and planets through professional telescopes with experts.",
        date: new Date('2024-11-05T20:30:00'),
        city: "Sky Observatory",
        images: ["https://images.unsplash.com/photo-1532973330544-767eef076840?w=1200&auto=format&fit=crop"],
        categoryName: "Outdoor",
        isFeatured: false,
        price: "20.0",
        capacity: 40,
        status: EventStatus.APPROVED
      },
      {
        title: "Handmade Pottery Class",
        description: "Learn traditional and modern pottery techniques and create your own pieces.",
        date: new Date('2024-06-30T10:00:00'),
        city: "Art Studio",
        images: ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop"],
        categoryName: "Art",
        isFeatured: false,
        price: "35.0",
        capacity: 12,
        status: EventStatus.APPROVED
      },
      {
        title: "Marathon City Run",
        description: "Join thousands of runners in the annual city marathon.",
        date: new Date('2024-09-15T06:00:00'),
        city: "Main City Square",
        images: ["https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop"],
        categoryName: "Sports",
        isFeatured: true,
        price: "5.0",
        capacity: 2000,
        status: EventStatus.APPROVED
      },
      {
        title: "Street Food Carnival",
        description: "The best street food vendors in the country in one place.",
        date: new Date('2024-08-25T12:00:00'),
        city: "City Expo Ground",
        images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop"],
        categoryName: "Food",
        isFeatured: false,
        price: "0",
        capacity: 2000,
        status: EventStatus.APPROVED
      },
      {
        title: "Coding Bootcamp Intro",
        description: "Thinking about a career in tech? Join our free introductory bootcamp.",
        date: new Date('2024-07-05T18:00:00'),
        city: "Tech Lab",
        images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop"],
        categoryName: "Tech",
        isFeatured: false,
        price: "0",
        capacity: 100,
        status: EventStatus.APPROVED
      },
      {
        title: "Meditation & Mindfulness",
        description: "Discover the power of meditation in this guided weekend workshop.",
        date: new Date('2024-07-12T09:00:00'),
        city: "Wellness Center",
        images: ["https://images.unsplash.com/photo-1528319725582-ddc096101511?w=1200&auto=format&fit=crop"],
        categoryName: "Wellness",
        isFeatured: true,
        price: "40.0",
        capacity: 30,
        status: EventStatus.APPROVED
      },
      {
        title: "The Great Outdoors Expo",
        description: "Everything you need for hiking, camping, and outdoor adventures.",
        date: new Date('2024-10-20T10:00:00'),
        city: "Convention Center",
        images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&auto=format&fit=crop"],
        categoryName: "Outdoor",
        isFeatured: false,
        price: "15.0",
        capacity: 1000,
        status: EventStatus.APPROVED
      },
      {
        title: "Networking After Hours",
        description: "Meet other professionals in a relaxed environment.",
        date: new Date('2024-06-28T18:30:00'),
        city: "Rooftop Lounge",
        images: ["https://images.unsplash.com/photo-1511632765486-a017907362b5?w=1200&auto=format&fit=crop"],
        categoryName: "Business",
        isFeatured: false,
        price: "0",
        capacity: 150,
        status: EventStatus.APPROVED
      },
      {
        title: "Board Game Marathon",
        description: "From classics to the latest strategy games, let's play all day!",
        date: new Date('2024-12-07T10:00:00'),
        city: "Community Hall",
        images: ["https://images.unsplash.com/photo-1610812391720-29354b07816b?w=1200&auto=format&fit=crop"],
        categoryName: "Social",
        isFeatured: false,
        price: "5.0",
        capacity: 60,
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
      },
      {
        title: "Sunday Brunch Meetup",
        description: "Looking for foodies to join for a relaxed Sunday brunch.",
        date: new Date('2024-06-29T11:00:00'),
        location: "The Breakfast Club",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Movie Night: Sci-Fi Classics",
        description: "Watching some old school sci-fi movies. Snacks provided!",
        date: new Date('2024-07-02T19:00:00'),
        location: "Alex's Place",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Library Study Session",
        description: "Preparing for the upcoming finals. Let's study together and stay motivated.",
        date: new Date('2024-06-18T14:00:00'),
        location: "City Library",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Picket Basketball Game",
        description: "Looking for 4 more players for a 5v5 friendly match.",
        date: new Date('2024-06-21T17:30:00'),
        location: "Community Center Courts",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Weekend Beach Getaway",
        description: "Planning a trip to the coast. Need carpool buddies!",
        date: new Date('2024-07-12T08:00:00'),
        location: "Sunshine Beach",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Live Jazz Night Buddies",
        description: "Going to the jazz club on Friday. Anyone wants to join?",
        date: new Date('2024-06-28T21:00:00'),
        location: "The Blue Note",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Early Morning Run Group",
        description: "Start your day with a 5k run. All paces welcome.",
        date: new Date('2024-06-19T06:00:00'),
        location: "River Side Path",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Language Exchange: Spanish/English",
        description: "Practice your Spanish or English in an informal setting.",
        date: new Date('2024-06-25T18:00:00'),
        location: "Global Cafe",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Potluck Picnic in the Park",
        description: "Bring a dish and share stories under the sun.",
        date: new Date('2024-07-07T13:00:00'),
        location: "Central Park West",
        status: PlanStatus.ACTIVE
      },
      {
        title: "Dog Park Playdate",
        description: "Bringing my Golden Retriever to the park. Other dog owners welcome!",
        date: new Date('2024-06-22T16:00:00'),
        location: "Bark & Play Park",
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

    // 5. Seed Notifications
    const notificationRepository = AppDataSource.getRepository(Notification);

    // Notifications for Regular User
    if (regularUser) {
      const userNotifications = [
        {
          title: "Welcome to EventHub!",
          message: "Thanks for joining our community. Start by exploring upcoming events.",
          type: NotificationType.INFO,
          isRead: true,
          userId: regularUser.id
        },
        {
          title: "Profile Incomplete",
          message: "Please complete your profile to get better event recommendations.",
          type: NotificationType.WARNING,
          isRead: false,
          link: "/profile",
          userId: regularUser.id
        },
        {
          title: "New Event in your city",
          message: "A new tech meetup has been scheduled in Addis Ababa.",
          type: NotificationType.INFO,
          isRead: false,
          link: "/browse/events",
          userId: regularUser.id
        }
      ];

      for (const notifData of userNotifications) {
        // Simple check to avoid duplicates for now, based on title and user
        const exists = await notificationRepository.findOne({
          where: { title: notifData.title, userId: regularUser.id }
        });

        if (!exists) {
          const notification = notificationRepository.create({
            ...notifData,
            user: regularUser
          });
          await notificationRepository.save(notification);
        }
      }
    }

    // Notifications for Organizer
    if (organizerUser) {
      const orgNotifications = [
        {
          title: "Event Approved",
          message: "Your 'Summer Music Festival' event has been approved and is now live.",
          type: NotificationType.SUCCESS,
          isRead: false,
          userId: organizerUser.id
        },
        {
          title: "New Application",
          message: "You have a new attendee application for 'Tech Startup Mixer'.",
          type: NotificationType.INFO,
          isRead: false,
          userId: organizerUser.id
        }
      ];

      for (const notifData of orgNotifications) {
        const exists = await notificationRepository.findOne({
          where: { title: notifData.title, userId: organizerUser.id }
        });

        if (!exists) {
          const notification = notificationRepository.create({
            ...notifData,
            user: organizerUser
          });
          await notificationRepository.save(notification);
        }
      }
    }
    console.log('Notifications seeded');

    console.log('Seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();