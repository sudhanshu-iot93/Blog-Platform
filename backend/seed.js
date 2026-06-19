const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Starting seed...');
  
  // Create a default author
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  let user = await prisma.user.findUnique({ where: { email: 'author@devlocal.io' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'DevLocal_Admin',
        email: 'author@devlocal.io',
        password: hashedPassword,
      }
    });
    console.log('Created test user: DevLocal_Admin');
  }

  const posts = [
    {
      title: 'The Future of IoT Devices in Smart Homes',
      content: '<p>The Internet of Things (IoT) is rapidly evolving. From smart refrigerators to connected thermostats, the modern home is becoming an integrated ecosystem of devices.</p><h2>Why IoT Matters</h2><p>In the coming years, we will see even more seamless integration between our daily appliances and our smart hubs, powered by low-latency networks and Edge AI.</p>',
      category: 'Technology',
    },
    {
      title: 'Top 5 Destinations for Solo Travelers in 2026',
      content: '<p>Traveling alone can be one of the most rewarding experiences. Here are my top 5 recommendations for solo adventurers:</p><ul><li><strong>Kyoto, Japan:</strong> Peaceful and extremely safe.</li><li><strong>Reykjavik, Iceland:</strong> Stunning landscapes and friendly locals.</li><li><strong>Lisbon, Portugal:</strong> Affordable and vibrant.</li><li><strong>Queenstown, New Zealand:</strong> For the thrill-seekers.</li><li><strong>Chiang Mai, Thailand:</strong> A digital nomad paradise.</li></ul>',
      category: 'Travel',
    },
    {
      title: 'How to Build Sustainable Daily Habits',
      content: '<p>We all want to improve our lives, but motivation fades. The key is to build <em>sustainable habits</em>.</p><blockquote><p>"We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle</p></blockquote><p>Start small. If you want to read more, commit to just two pages a night. It’s the consistency that rewires your brain, not the intensity.</p>',
      category: 'Lifestyle',
    },
    {
      title: 'Understanding Modern Web Development with React',
      content: '<p>React has completely transformed how we build user interfaces. The component-based architecture allows for incredible reusability and clean code separation.</p><h3>Key Concepts</h3><ol><li>State and Props</li><li>Hooks (useState, useEffect)</li><li>Context API</li></ol><p>If you are just starting out, don\'t get overwhelmed by the ecosystem. Focus purely on understanding how React handles state and re-renders.</p>',
      category: 'Education',
    },
    {
      title: 'The Ultimate Recipe for Homemade Sourdough',
      content: '<p>Baking sourdough is a mix of science and art. The most important ingredient is patience!</p><p>You will need a healthy, active starter. Once you have that, the process involves autolyse, stretching and folding, bulk fermentation, and finally, a slow cold proof in the fridge.</p><p><strong>Pro Tip:</strong> Use a Dutch oven to trap steam and get that perfect crust.</p>',
      category: 'Food',
    }
  ];

  for (const postData of posts) {
    const existing = await prisma.post.findFirst({ where: { title: postData.title } });
    if (!existing) {
      await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          category: postData.category,
          authorId: user.id
        }
      });
      console.log(`Created post: ${postData.title}`);
    } else {
      console.log(`Skipped existing post: ${postData.title}`);
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
