const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

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
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
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
    const [totalUsers, activeUsers, adminUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      adminUsers,
    };
  }
}

module.exports = UserModel;
