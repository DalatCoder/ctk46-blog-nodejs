const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedComments() {
  console.log('🌱 Seeding comments...');

  try {
    // Get the first post and user
    const posts = await prisma.post.findMany({ take: 3 });
    const users = await prisma.user.findMany({ take: 2 });

    if (posts.length === 0) {
      console.log('❌ No posts found. Please seed posts first.');
      return;
    }

    // Create sample comments
    const comments = [
      {
        content: 'Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ những kiến thức quý báu này.',
        postId: posts[0].id,
        authorName: 'Nguyễn Văn A',
        authorEmail: 'nguyenvana@example.com',
        authorWebsite: 'https://nguyenvana.com',
        authorIp: '192.168.1.1',
        status: 'APPROVED',
        userId: users[0]?.id || null,
      },
      {
        content: 'Mình có một câu hỏi về phần này. Có thể giải thích rõ hơn được không?',
        postId: posts[0].id,
        authorName: 'Trần Thị B',
        authorEmail: 'tranthib@example.com',
        authorIp: '192.168.1.2',
        status: 'PENDING',
        userId: users[1]?.id || null,
      },
      {
        content: 'Thông tin rất hữu ích, đã bookmark để đọc lại sau!',
        postId: posts[1]?.id || posts[0].id,
        authorName: 'Lê Văn C',
        authorEmail: 'levanc@example.com',
        authorIp: '192.168.1.3',
        status: 'APPROVED',
      },
      {
        content: 'Spam comment này là để test chức năng spam detection.',
        postId: posts[0].id,
        authorName: 'Spam User',
        authorEmail: 'spam@spam.com',
        authorIp: '192.168.1.4',
        status: 'SPAM',
      },
      {
        content: 'Comment này bị từ chối vì nội dung không phù hợp.',
        postId: posts[0].id,
        authorName: 'Bad User',
        authorEmail: 'baduser@example.com',
        authorIp: '192.168.1.5',
        status: 'TRASH',
      },
      {
        content: 'Bài viết tuyệt vời! Tôi đã học được rất nhiều điều mới từ bài này. Cảm ơn tác giả!',
        postId: posts[1]?.id || posts[0].id,
        authorName: 'Phạm Thị D',
        authorEmail: 'phamthid@example.com',
        authorWebsite: 'https://phamthid.blog',
        authorIp: '192.168.1.6',
        status: 'APPROVED',
      },
      {
        content: 'Có thể làm một video hướng dẫn chi tiết về chủ đề này không?',
        postId: posts[2]?.id || posts[0].id,
        authorName: 'Hoàng Văn E',
        authorEmail: 'hoangvane@example.com',
        authorIp: '192.168.1.7',
        status: 'PENDING',
      },
      {
        content: 'Mình đã áp dụng theo hướng dẫn và thành công. Thanks!',
        postId: posts[1]?.id || posts[0].id,
        authorName: 'Đặng Thị F',
        authorEmail: 'dangthif@example.com',
        authorIp: '192.168.1.8',
        status: 'APPROVED',
        userId: users[0]?.id || null,
      }
    ];

    const createdComments = [];
    
    for (const comment of comments) {
      const created = await prisma.comment.create({
        data: comment,
      });
      createdComments.push(created);
      console.log(`✅ Created comment: ${comment.authorName} - ${comment.content.substring(0, 50)}...`);
    }

    // Create some replies to the first comment
    const replies = [
      {
        content: 'Cảm ơn bạn đã đọc! Rất vui khi bài viết giúp ích được cho bạn.',
        postId: posts[0].id,
        parentId: createdComments[0].id,
        authorName: 'Admin',
        authorEmail: 'admin@example.com',
        authorIp: '127.0.0.1',
        status: 'APPROVED',
        userId: users[0]?.id || null,
      },
      {
        content: 'Tôi cũng đồng ý với bạn! Bài viết thực sự chất lượng.',
        postId: posts[0].id,
        parentId: createdComments[0].id,
        authorName: 'Người dùng khác',
        authorEmail: 'user@example.com',
        authorIp: '192.168.1.10',
        status: 'APPROVED',
      }
    ];

    for (const reply of replies) {
      await prisma.comment.create({
        data: reply,
      });
      console.log(`✅ Created reply: ${reply.authorName} - ${reply.content.substring(0, 50)}...`);
    }

    console.log('🎉 Comments seeded successfully!');
    console.log(`📊 Created ${comments.length} comments and ${replies.length} replies`);

  } catch (error) {
    console.error('❌ Error seeding comments:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedComments();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedComments };
