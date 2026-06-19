const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const postsData = [
  {
    title: 'The Rise of Quantum Computing: What You Need to Know',
    content: '<p>Quantum computing is rapidly moving from theoretical physics to practical engineering. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits.</p><h2>Why it Matters</h2><p>This paradigm shift will drastically accelerate discoveries in cryptography, materials science, and complex system modeling. The race for quantum supremacy is just getting started.</p>',
    category: 'Technology',
    sourceImg: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\quantum_computing_1781760450454.png`,
    filename: 'quantum_computing.png'
  },
  {
    title: 'Minimalism in a Digital Age',
    content: '<p>In an era of endless notifications and infinite scrolls, digital minimalism is becoming a crucial survival skill.</p><p>By intentionally curating our digital inputs—unsubscribing, turning off non-essential alerts, and setting screen-time boundaries—we can reclaim hours of lost focus every single day.</p>',
    category: 'Lifestyle',
    sourceImg: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\digital_minimalism_1781760462814.png`,
    filename: 'digital_minimalism.png'
  },
  {
    title: 'Mastering TypeScript: Advanced Patterns',
    content: '<p>TypeScript has evolved far beyond just adding types to JavaScript. It is a powerful structural typing system.</p><h2>Utility Types</h2><p>Understanding advanced utility types like <code>Omit</code>, <code>Pick</code>, and conditional types allows developers to build robust, scalable architectures that catch bugs at compile time rather than runtime.</p>',
    category: 'Education',
    sourceImg: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\typescript_patterns_1781760476426.png`,
    filename: 'typescript_patterns.png'
  },
  {
    title: 'Hidden Gems of Kyoto: A Complete Guide',
    content: '<p>While the Golden Pavilion and Fushimi Inari are must-sees, Kyoto’s true magic lies in its hidden alleyways.</p><p>Explore the quiet, moss-covered temples in the northern mountains and the intimate tea houses of Gion at dusk to experience the authentic, serene spirit of old Japan.</p>',
    category: 'Travel',
    sourceImg: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\kyoto_travel_1781760493117.png`,
    filename: 'kyoto_travel.png'
  },
  {
    title: 'The Science Behind the Perfect Espresso Pull',
    content: '<p>Extracting the perfect shot of espresso is an intricate dance of pressure, temperature, and time.</p><h2>The Variables</h2><p>From the precise grind size to the 9 bars of pressure and the 200°F water, mastering these variables results in a rich, syrupy shot topped with thick golden crema.</p>',
    category: 'Food',
    sourceImg: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\espresso_pull_1781760505155.png`,
    filename: 'espresso_pull.png'
  },
  {
    title: 'Designing the Perfect Home Office Setup',
    content: '<p>As remote work becomes the standard, investing in your home office is an investment in your productivity.</p><p>Prioritize ergonomics first with a supportive chair and monitor at eye level. Then, introduce biophilic design elements like natural light and indoor plants to reduce stress and boost creativity.</p>',
    category: 'Lifestyle',
    sourceImg: String.raw`C:\Users\sudha\.gemini\antigravity-ide\brain\c3c24aaf-94a8-408d-acbe-d90f596aa6b7\home_office_1781760518026.png`,
    filename: 'home_office.png'
  }
];

async function main() {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Find or create a user to author these posts
  let author = await prisma.user.findFirst();
  if (!author) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    author = await prisma.user.create({
      data: {
        username: 'AuraEditor',
        email: 'editor@aura.com',
        password: hashedPassword,
      }
    });
  }

  for (const item of postsData) {
    const dest = path.join(uploadsDir, item.filename);
    
    // Copy the file
    if (fs.existsSync(item.sourceImg)) {
      fs.copyFileSync(item.sourceImg, dest);
      console.log(`Copied ${item.filename}`);
      
      // Create post
      await prisma.post.create({
        data: {
          title: item.title,
          content: item.content,
          category: item.category,
          imageUrl: `/uploads/${item.filename}`,
          authorId: author.id
        }
      });
      console.log(`Created post: ${item.title}`);
    } else {
      console.log(`Source file not found: ${item.sourceImg}`);
    }
  }
  
  console.log('Finished seeding new posts!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
