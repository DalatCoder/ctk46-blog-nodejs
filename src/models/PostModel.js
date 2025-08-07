const prisma = require('../config/database');
const slugify = require('slugify');

class PostModel {
  // Create new post
  static async create(postData) {
    const { tags, ...otherData } = postData;
    
    // Generate slug if not provided
    if (!otherData.slug) {
      otherData.slug = slugify(otherData.title, { lower: true, strict: true });
    }

    // Set published date if status is published
    if (otherData.status === 'PUBLISHED' && !otherData.publishedAt) {
      otherData.publishedAt = new Date();
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    if (otherData.content) {
      const wordCount = otherData.content.split(/\s+/).length;
      otherData.readingTime = Math.ceil(wordCount / 200);
    }

    const post = await prisma.post.create({
      data: otherData,
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
    });

    // Add tags if provided
    if (tags && tags.length > 0) {
      await this.addTags(post.id, tags);
    }

    return post;
  }

  // Find post by ID
  static async findById(id, includeRelations = false) {
    const include = includeRelations ? {
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      category: true,
      postTags: {
        include: {
          tag: true,
        },
      },
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'asc' },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    } : undefined;

    return await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include,
    });
  }

  // Find post by slug
  static async findBySlug(slug, includeRelations = true) {
    const include = includeRelations ? {
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      category: true,
      postTags: {
        include: {
          tag: true,
        },
      },
      comments: {
        where: { status: 'APPROVED', parentId: null },
        orderBy: { createdAt: 'asc' },
        include: {
          replies: {
            where: { status: 'APPROVED' },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    } : undefined;

    return await prisma.post.findUnique({
      where: { slug },
      include,
    });
  }

  // Get all posts with pagination and filters
  static async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.categoryId) where.categoryId = parseInt(filters.categoryId);
    if (filters.authorId) where.authorId = parseInt(filters.authorId);
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { excerpt: { contains: filters.search } },
        { content: { contains: filters.search } },
      ];
    }

    const orderBy = {};
    if (filters.sortBy === 'views') {
      orderBy.viewsCount = 'desc';
    } else if (filters.sortBy === 'likes') {
      orderBy.likesCount = 'desc';
    } else if (filters.sortBy === 'title') {
      orderBy.title = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
          postTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.post.count({ where }),
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

  // Update post
  static async update(id, postData) {
    const { tags, ...otherData } = postData;
    
    // Update slug if title changed
    if (otherData.title) {
      otherData.slug = slugify(otherData.title, { lower: true, strict: true });
    }

    // Set published date if status changed to published
    if (otherData.status === 'PUBLISHED') {
      const currentPost = await this.findById(id);
      if (currentPost.status !== 'PUBLISHED' && !otherData.publishedAt) {
        otherData.publishedAt = new Date();
      }
    }

    // Update reading time if content changed
    if (otherData.content) {
      const wordCount = otherData.content.split(/\s+/).length;
      otherData.readingTime = Math.ceil(wordCount / 200);
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: otherData,
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
    });

    // Update tags if provided
    if (tags !== undefined) {
      // Remove existing tags
      await prisma.postTag.deleteMany({
        where: { postId: parseInt(id) },
      });
      
      // Add new tags
      if (tags.length > 0) {
        await this.addTags(post.id, tags);
      }
    }

    return post;
  }

  // Delete post
  static async delete(id) {
    return await prisma.post.delete({
      where: { id: parseInt(id) },
    });
  }

  // Increment view count
  static async incrementViews(id, viewData = {}) {
    // Record the view
    if (viewData.ipAddress) {
      await prisma.postView.create({
        data: {
          postId: parseInt(id),
          userId: viewData.userId || null,
          ipAddress: viewData.ipAddress,
          userAgent: viewData.userAgent || null,
          referer: viewData.referer || null,
          sessionId: viewData.sessionId || null,
        },
      });
    }

    // Increment view count
    return await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });
  }

  // Add tags to post
  static async addTags(postId, tagNames) {
    for (const tagName of tagNames) {
      // Find or create tag
      let tag = await prisma.tag.findUnique({
        where: { name: tagName.trim() },
      });

      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name: tagName.trim(),
            slug: slugify(tagName.trim(), { lower: true, strict: true }),
          },
        });
      }

      // Create post-tag relationship
      await prisma.postTag.upsert({
        where: {
          postId_tagId: {
            postId: parseInt(postId),
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          postId: parseInt(postId),
          tagId: tag.id,
        },
      });
    }
  }

  // Get related posts
  static async getRelated(postId, categoryId, limit = 3) {
    return await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: parseInt(postId) } },
          { categoryId: parseInt(categoryId) },
          { status: 'PUBLISHED' },
        ],
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
    });
  }

  // Get post statistics
  static async getStats() {
    const [totalPosts, publishedPosts, draftPosts, archivedPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.count({ where: { status: 'ARCHIVED' } }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
    };
  }
}

module.exports = PostModel;
