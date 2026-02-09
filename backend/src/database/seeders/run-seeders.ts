import { AppDataSource } from '../../config/database';
import { initializeDatabase } from '../connection';
import { Category } from '../../models/Category';

async function runSeeders() {
  try {
    await initializeDatabase();
    
    // Seed categories
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

    for (const categoryData of defaultCategories) {
      const category = categoryRepository.create(categoryData);
      await categoryRepository.save(category);
    }

    console.log('Seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();