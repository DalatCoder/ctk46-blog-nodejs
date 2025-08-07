const prisma = require('../config/database');
const slugify = require('slugify');

class CategoryModel {
  // Create new category
  static async create(categoryData) {
    if (!categoryData.slug) {
      categoryData.slug = slugify(categoryData.name, { lower: true, strict: true });
    }

    return await prisma.category.create({
      data: categoryData,
    });
  }

  // Find category by ID
  static async findById(id) {
    return await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  // Find category by slug
  static async findBySlug(slug) {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  // Get all categories
  static async getAll(includeChildren = false) {
    const include = includeChildren ? {
      parent: true,
      children: true,
    } : undefined;

    return await prisma.category.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include,
    });
  }

  // Get categories with post count
  static async getAllWithPostCount() {
    return await prisma.category.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    });
  }

  // Get featured categories
  static async getFeatured() {
    return await prisma.category.findMany({
      where: { isFeatured: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Update category
  static async update(id, categoryData) {
    // Only allow safe fields to prevent unknown field errors
    const allowedFields = ['name', 'slug', 'description', 'isFeatured', 'color', 'icon', 'sortOrder', 'metaTitle', 'metaDescription'];
    const safeData = {};
    
    for (const [key, value] of Object.entries(categoryData)) {
      if (allowedFields.includes(key)) {
        safeData[key] = value;
      }
    }
    
    if (safeData.name && !safeData.slug) {
      safeData.slug = slugify(safeData.name, { lower: true, strict: true });
    }

    return await prisma.category.update({
      where: { id: parseInt(id) },
      data: safeData,
    });
  }

  // Delete category
  static async delete(id) {
    // Check if category has posts
    const postCount = await prisma.post.count({
      where: { categoryId: parseInt(id) },
    });

    if (postCount > 0) {
      throw new Error('Cannot delete category with existing posts');
    }

    return await prisma.category.delete({
      where: { id: parseInt(id) },
    });
  }

  // Update post count for category
  static async updatePostCount(categoryId) {
    const postCount = await prisma.post.count({
      where: {
        categoryId: parseInt(categoryId),
        status: 'PUBLISHED',
      },
    });

    return await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: { postCount },
    });
  }

  // Update all post counts
  static async updateAllPostCounts() {
    const categories = await prisma.category.findMany();
    
    for (const category of categories) {
      await this.updatePostCount(category.id);
    }
  }

  // Get posts by category
  static async getPosts(categoryId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          categoryId: parseInt(categoryId),
          status: 'PUBLISHED',
        },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          category: true,
        },
      }),
      prisma.post.count({
        where: {
          categoryId: parseInt(categoryId),
          status: 'PUBLISHED',
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Get category statistics
  static async getStats() {
    const [totalCategories, featuredCategories] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({ where: { isFeatured: true } }),
    ]);

    return {
      totalCategories,
      featuredCategories,
    };
  }

  // Get post count for category
  static async getPostCount(categoryId) {
    return await prisma.post.count({
      where: { categoryId: parseInt(categoryId) },
    });
  }
}

module.exports = CategoryModel;
