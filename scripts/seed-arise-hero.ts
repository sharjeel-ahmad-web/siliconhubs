import clientPromise from '@/lib/db/mongodb';

async function seedAriseHeroContent() {
  const client = await clientPromise;
  const db = client.db('rising-dot');
  const collection = db.collection('siteContent');

  const heroContent = {
    page: 'home',
    section: 'hero',
    content: {
      eyebrow: 'Digital Excellence Delivered',
      title: 'Rising Dot Agency',
      subtitle:
        'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaLink: '/portfolio',
    },
    visible: true,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  await collection.updateOne(
    { page: 'home', section: 'hero' },
    { $set: heroContent },
    { upsert: true }
  );

  console.log('✅ Arise Hero content seeded!');
  process.exit(0);
}

seedAriseHeroContent().catch(console.error);
