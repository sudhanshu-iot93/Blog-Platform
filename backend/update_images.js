const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const updates = [
  {
    title: 'The Future of IoT Devices in Smart Homes',
    source: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\iot_smart_home_1781751441032.png`,
    filename: 'iot_smart_home.png'
  },
  {
    title: 'Top 5 Destinations for Solo Travelers in 2026',
    source: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\solo_travel_destinations_1781751474664.png`,
    filename: 'solo_travel_destinations.png'
  },
  {
    title: 'How to Build Sustainable Daily Habits',
    source: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\sustainable_habits_1781751490451.png`,
    filename: 'sustainable_habits.png'
  },
  {
    title: 'Understanding Modern Web Development with React',
    source: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\react_web_development_1781751510128.png`,
    filename: 'react_web_development.png'
  },
  {
    title: 'The Ultimate Recipe for Homemade Sourdough',
    source: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\sourdough_bread_1781751529622.png`,
    filename: 'sourdough_bread.png'
  }
];

async function main() {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  for (const item of updates) {
    const dest = path.join(uploadsDir, item.filename);
    
    // Copy the file
    if (fs.existsSync(item.source)) {
      fs.copyFileSync(item.source, dest);
      console.log(`Copied ${item.filename}`);
      
      // Update database
      const post = await prisma.post.findFirst({ where: { title: item.title } });
      if (post) {
        await prisma.post.update({
          where: { id: post.id },
          data: { imageUrl: `/uploads/${item.filename}` }
        });
        console.log(`Updated post: ${item.title}`);
      } else {
        console.log(`Post not found: ${item.title}`);
      }
    } else {
      console.log(`Source file not found: ${item.source}`);
    }
  }
  
  console.log('Finished updating images!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
