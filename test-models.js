const PostModel = require('./src/models/PostModel');
const CategoryModel = require('./src/models/CategoryModel');

async function testModels() {
  try {
    console.log('Testing PostModel...');
    
    // Test getting all posts
    const posts = await PostModel.getAll(1, 5, { status: 'PUBLISHED' });
    console.log('Posts found:', posts.posts.length);
    
    // Test getting featured posts
    const featuredPosts = await PostModel.getAll(1, 3, { 
      status: 'PUBLISHED', 
      isFeatured: true 
    });
    console.log('Featured posts found:', featuredPosts.posts.length);
    
    // Test categories
    console.log('Testing CategoryModel...');
    const categories = await CategoryModel.getFeatured();
    console.log('Categories found:', categories.length);
    
    console.log('All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testModels();
