const prisma = require('../config/database');

class CommentModel {
  // Create new comment
  static async create(commentData) {
    return await prisma.comment.create({
      data: commentData,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        parent: true,
      },
    });
  }

  // Find comment by ID
  static async findById(id) {
    return await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        parent: true,
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  // Get all comments with pagination and filters
  static async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.postId) where.postId = parseInt(filters.postId);
    if (filters.parentId === null) where.parentId = null;
    if (filters.search) {
      where.OR = [
        { content: { contains: filters.search } },
        { authorName: { contains: filters.search } },
        { authorEmail: { contains: filters.search } },
      ];
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          parent: {
            select: {
              id: true,
              authorName: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      comments,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Get comments for a specific post
  static async getByPost(postId, status = 'APPROVED') {
    return await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
        status,
        parentId: null, // Only parent comments
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        replies: {
          where: { status },
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  // Update comment
  static async update(id, commentData) {
    return await prisma.comment.update({
      where: { id: parseInt(id) },
      data: commentData,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Delete comment
  static async delete(id) {
    return await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
  }

  // Update comment status
  static async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  // Approve comment
  static async approve(id) {
    return await this.updateStatus(id, 'APPROVED');
  }

  // Mark as spam
  static async markAsSpam(id) {
    return await this.updateStatus(id, 'SPAM');
  }

  // Move to trash
  static async moveToTrash(id) {
    return await this.updateStatus(id, 'TRASH');
  }

  // Update comments count for a post
  static async updatePostCommentsCount(postId) {
    const commentsCount = await prisma.comment.count({
      where: {
        postId: parseInt(postId),
        status: 'APPROVED',
      },
    });

    return await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { commentsCount },
    });
  }

  // Get comment statistics
  static async getStats() {
    const [total, approved, pending, spam] = await Promise.all([
      prisma.comment.count(),
      prisma.comment.count({ where: { status: 'APPROVED' } }),
      prisma.comment.count({ where: { status: 'PENDING' } }),
      prisma.comment.count({ where: { status: 'SPAM' } }),
    ]);

    return {
      total,
      approved,
      pending,
      spam,
    };
  }

  // Get recent comments for admin dashboard
  static async getRecent(limit = 5) {
    return await prisma.comment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Update comment status
  static async updateStatus(id, status) {
    return await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { 
        status,
        moderatedAt: new Date(),
      },
    });
  }

  // Bulk update comment status
  static async bulkUpdateStatus(ids, status) {
    return await prisma.comment.updateMany({
      where: {
        id: {
          in: ids.map(id => parseInt(id)),
        },
      },
      data: { 
        status,
        moderatedAt: new Date(),
      },
    });
  }

  // Bulk delete comments
  static async bulkDelete(ids) {
    return await prisma.comment.deleteMany({
      where: {
        id: {
          in: ids.map(id => parseInt(id)),
        },
      },
    });
  }

  // Get comment statistics
  static async getStatistics() {
    const [total, pending, approved, trash, spam] = await Promise.all([
      prisma.comment.count(),
      prisma.comment.count({ where: { status: 'PENDING' } }),
      prisma.comment.count({ where: { status: 'APPROVED' } }),
      prisma.comment.count({ where: { status: 'TRASH' } }),
      prisma.comment.count({ where: { status: 'SPAM' } }),
    ]);

    return {
      total,
      pending,
      approved,
      trash,
      spam,
    };
  }

  // Delete comment
  static async delete(id) {
    return await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = CommentModel;
