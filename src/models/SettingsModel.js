const prisma = require('../config/database');

class SettingsModel {
  // Get all settings
  static async getAll() {
    try {
      const settings = await prisma.setting.findMany({
        orderBy: { settingKey: 'asc' }
      });
      
      // Convert to key-value object
      const settingsObj = {};
      settings.forEach(setting => {
        settingsObj[setting.settingKey] = {
          value: setting.settingValue,
          type: setting.settingType,
          description: setting.description
        };
      });
      
      return settingsObj;
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  // Get setting by key
  static async get(key) {
    try {
      const setting = await prisma.setting.findUnique({
        where: { settingKey: key }
      });
      return setting ? setting.settingValue : null;
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return null;
    }
  }

  // Set setting value
  static async set(key, value, type = 'string', description = '') {
    try {
      return await prisma.setting.upsert({
        where: { settingKey: key },
        update: { settingValue: value, settingType: type, description },
        create: { settingKey: key, settingValue: value, settingType: type, description }
      });
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  // Update multiple settings
  static async updateMultiple(settings) {
    try {
      const updates = [];
      
      for (const [key, data] of Object.entries(settings)) {
        updates.push(
          prisma.setting.upsert({
            where: { settingKey: key },
            update: { 
              settingValue: data.value, 
              settingType: data.type || 'string', 
              description: data.description || '' 
            },
            create: { 
              settingKey: key, 
              settingValue: data.value, 
              settingType: data.type || 'string', 
              description: data.description || '' 
            }
          })
        );
      }
      
      return await Promise.all(updates);
    } catch (error) {
      console.error('Error updating multiple settings:', error);
      throw error;
    }
  }

  // Initialize default settings
  static async initializeDefaults() {
    try {
      const defaultSettings = [
        {
          settingKey: 'site_name',
          settingValue: 'My Website',
          settingType: 'string',
          description: 'Tên của trang web'
        },
        {
          settingKey: 'site_description',
          settingValue: 'A great website',
          settingType: 'text',
          description: 'Mô tả trang web cho SEO'
        },
        {
          settingKey: 'site_keywords',
          settingValue: 'blog, news, articles',
          settingType: 'string',
          description: 'Từ khóa trang web cho SEO'
        },
        {
          settingKey: 'admin_email',
          settingValue: 'admin@example.com',
          settingType: 'email',
          description: 'Địa chỉ email quản trị viên'
        },
        {
          settingKey: 'posts_per_page',
          settingValue: '10',
          settingType: 'number',
          description: 'Số bài viết hiển thị mỗi trang'
        },
        {
          settingKey: 'enable_comments',
          settingValue: 'true',
          settingType: 'boolean',
          description: 'Cho phép bình luận trên bài viết'
        },
        {
          settingKey: 'comment_moderation',
          settingValue: 'true',
          settingType: 'boolean',
          description: 'Yêu cầu duyệt bình luận mới'
        },
        {
          settingKey: 'enable_registration',
          settingValue: 'false',
          settingType: 'boolean',
          description: 'Cho phép đăng ký người dùng mới'
        },
        {
          settingKey: 'timezone',
          settingValue: 'Asia/Ho_Chi_Minh',
          settingType: 'string',
          description: 'Múi giờ của trang web'
        },
        {
          settingKey: 'date_format',
          settingValue: 'DD/MM/YYYY',
          settingType: 'string',
          description: 'Định dạng hiển thị ngày tháng'
        },
        {
          settingKey: 'maintenance_mode',
          settingValue: 'false',
          settingType: 'boolean',
          description: 'Bật chế độ bảo trì'
        },
        {
          settingKey: 'google_analytics_id',
          settingValue: '',
          settingType: 'string',
          description: 'ID theo dõi Google Analytics'
        }
      ];

      for (const setting of defaultSettings) {
        await prisma.setting.upsert({
          where: { settingKey: setting.settingKey },
          update: {},
          create: setting
        });
      }

      return true;
    } catch (error) {
      console.error('Error initializing default settings:', error);
      throw error;
    }
  }

  // Delete setting
  static async delete(key) {
    try {
      return await prisma.setting.delete({
        where: { settingKey: key }
      });
    } catch (error) {
      console.error(`Error deleting setting ${key}:`, error);
      throw error;
    }
  }

  // Get settings by category
  static async getByCategory(category) {
    try {
      const settingsMap = {
        general: ['site_name', 'site_description', 'site_keywords', 'admin_email', 'timezone', 'date_format'],
        content: ['posts_per_page', 'enable_comments', 'comment_moderation'],
        users: ['enable_registration'],
        system: ['maintenance_mode'],
        analytics: ['google_analytics_id']
      };

      if (!settingsMap[category]) {
        return {};
      }

      const settings = await prisma.setting.findMany({
        where: {
          settingKey: {
            in: settingsMap[category]
          }
        }
      });

      const result = {};
      settings.forEach(setting => {
        result[setting.settingKey] = {
          value: setting.settingValue,
          type: setting.settingType,
          description: setting.description
        };
      });

      return result;
    } catch (error) {
      console.error(`Error getting settings for category ${category}:`, error);
      return {};
    }
  }
}

module.exports = SettingsModel;
