const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

// Helper function to generate pagination pages
function generatePaginationPages(currentPage, totalPages) {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push({
      number: i,
      current: i === currentPage,
      url: `?page=${i}`
    });
  }

  return pages;
}

class UserModel {
  // Create new user
  static async create(userData) {
    const { password, ...otherData } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await prisma.user.create({
      data: {
        ...otherData,
        password: hashedPassword,
      },
    });
  }

  // Find user by email
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Find user by username
  static async findByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  // Find user by username with password (for authentication)
  static async findByUsernameWithPassword(username) {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Find user by email with password (for authentication)
  static async findByEmailWithPassword(email) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Find user by ID
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        status: true,
        bio: true,
        website: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Validate password
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update last login
  static async updateLastLogin(id) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        lastLoginAt: new Date(),
        loginCount: {
          increment: 1,
        },
      },
    });
  }

  // Get all users with pagination
  static async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const where = {};
    if (filters.role) where.role = filters.role;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search } },
        { email: { contains: filters.search } },
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
        pages: generatePaginationPages(page, Math.ceil(total / limit))
      },
    };
  }

  // Update user
  static async update(id, userData) {
    const { password, ...otherData } = userData;
    
    const updateData = { ...otherData };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  // Delete user
  static async delete(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }

  // Get user statistics
  static async getStats() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, active, admin, newThisMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ 
        where: { 
          createdAt: {
            gte: startOfMonth
          }
        } 
      }),
    ]);

    return {
      total,
      active,
      admin,
      newThisMonth,
    };
  }

  // Bulk update user status
  static async bulkUpdateStatus(userIds, status) {
    return prisma.user.updateMany({
      where: {
        id: {
          in: userIds.map(id => parseInt(id))
        }
      },
      data: {
        status,
        updatedAt: new Date()
      }
    });
  }

  // Bulk update user role
  static async bulkUpdateRole(userIds, role) {
    return prisma.user.updateMany({
      where: {
        id: {
          in: userIds.map(id => parseInt(id))
        }
      },
      data: {
        role,
        updatedAt: new Date()
      }
    });
  }

  // Bulk delete users
  static async bulkDelete(userIds) {
    return prisma.user.deleteMany({
      where: {
        id: {
          in: userIds.map(id => parseInt(id))
        }
      }
    });
  }
}

module.exports = UserModel;
