const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...');

    const categories = [
      {
        name: 'Công nghệ',
        slug: 'cong-nghe',
        description: 'Tin tức và bài viết về công nghệ thông tin',
        isFeatured: true,
        sortOrder: 1,
        color: '#3b82f6'
      },
      {
        name: 'Lập trình',
        slug: 'lap-trinh',
        description: 'Hướng dẫn và kinh nghiệm lập trình',
        isFeatured: true,
        sortOrder: 2,
        color: '#10b981'
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Phát triển ứng dụng web',
        isFeatured: false,
        sortOrder: 3,
        color: '#8b5cf6'
      },
      {
        name: 'Mobile App',
        slug: 'mobile-app',
        description: 'Phát triển ứng dụng di động',
        isFeatured: false,
        sortOrder: 4,
        color: '#f59e0b'
      },
      {
        name: 'DevOps',
        slug: 'devops',
        description: 'Vận hành và triển khai hệ thống',
        isFeatured: false,
        sortOrder: 5,
        color: '#ef4444'
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      });

      if (!existingCategory) {
        const category = await prisma.category.create({
          data: categoryData
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⚠️  Category already exists: ${categoryData.name}`);
      }
    }

    console.log('🎉 Categories seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
