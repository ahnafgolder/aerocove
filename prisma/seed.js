const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({});

async function main() {
  // 1. Create Admin
  const hashedPassword = await bcrypt.hash('sukuna4321$$', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'sukuna123@admin.com' },
    update: { password: hashedPassword },
    create: {
      email: 'sukuna123@admin.com',
      password: hashedPassword,
      name: 'Aerocove Admin',
    },
  });
  console.log({ admin });

  // 2. Create Categories
  const catMen = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'Men', slug: 'men' },
  });

  const catWomen = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: { name: 'Women', slug: 'women' },
  });

  const catAll = await prisma.category.upsert({
    where: { slug: 'all' },
    update: {},
    create: { name: 'All', slug: 'all' },
  });

  // 3. Create Phone Models
  const phoneModels = [
    'iPhone 15',
    'iPhone 15 Pro',
    'iPhone 15 Pro Max',
    'iPhone 16',
    'iPhone 16 Pro',
    'iPhone 16 Pro Max',
    'Samsung S24',
    'Samsung S24 Ultra',
    'Pixel 8',
    'Pixel 8 Pro',
  ];

  const createdModels = {};
  for (const name of phoneModels) {
    const model = await prisma.phoneModel.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdModels[name] = model;
  }
  console.log('Created', Object.keys(createdModels).length, 'phone models');

  // 4. Create Sample Products with categories (m2m) and variants
  const product1 = await prisma.product.upsert({
    where: { slug: 'crystal-clear-iphone-15' },
    update: {},
    create: {
      name: 'Crystal Clear for iPhone 15',
      slug: 'crystal-clear-iphone-15',
      description: 'Ultra-clear, anti-yellowing case that shows off your phone.',
      price: 1200,
      comparePrice: 1500,
      featured: true,
      images: JSON.stringify(['https://placehold.co/600x750/e8ecff/4f6ef7?text=Crystal+Clear\\niPhone+15&font=raleway']),
      categories: { connect: [{ id: catAll.id }] },
    },
  });
  // Add variants
  for (const modelName of ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max']) {
    await prisma.productVariant.upsert({
      where: { productId_phoneModelId: { productId: product1.id, phoneModelId: createdModels[modelName].id } },
      update: {},
      create: { productId: product1.id, phoneModelId: createdModels[modelName].id, stock: 25 },
    });
  }

  const product2 = await prisma.product.upsert({
    where: { slug: 'midnight-matte-s24-ultra' },
    update: {},
    create: {
      name: 'Midnight Matte for S24 Ultra',
      slug: 'midnight-matte-s24-ultra',
      description: 'Silky smooth matte finish, fingerprint resistant.',
      price: 1400,
      featured: true,
      images: JSON.stringify(['https://placehold.co/600x750/f3effe/8b5cf6?text=Midnight+Matte\\nS24+Ultra&font=raleway']),
      categories: { connect: [{ id: catMen.id }] },
    },
  });
  for (const modelName of ['Samsung S24', 'Samsung S24 Ultra']) {
    await prisma.productVariant.upsert({
      where: { productId_phoneModelId: { productId: product2.id, phoneModelId: createdModels[modelName].id } },
      update: {},
      create: { productId: product2.id, phoneModelId: createdModels[modelName].id, stock: 15 },
    });
  }

  const product3 = await prisma.product.upsert({
    where: { slug: 'floral-garden-iphone-15-pro' },
    update: {},
    create: {
      name: 'Floral Garden iPhone 15 Pro',
      slug: 'floral-garden-iphone-15-pro',
      description: 'Beautiful floral pattern designer case with premium build quality.',
      price: 1600,
      comparePrice: 2000,
      featured: true,
      images: JSON.stringify(['https://placehold.co/600x750/ecfdf5/10b981?text=Floral+Garden\\niPhone+15+Pro&font=raleway']),
      categories: { connect: [{ id: catWomen.id }] },
    },
  });
  for (const modelName of ['iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16 Pro']) {
    await prisma.productVariant.upsert({
      where: { productId_phoneModelId: { productId: product3.id, phoneModelId: createdModels[modelName].id } },
      update: {},
      create: { productId: product3.id, phoneModelId: createdModels[modelName].id, stock: 10 },
    });
  }

  const product4 = await prisma.product.upsert({
    where: { slug: 'ocean-blue-matte-pixel-8' },
    update: {},
    create: {
      name: 'Ocean Blue Matte Pixel 8',
      slug: 'ocean-blue-matte-pixel-8',
      description: 'Stunning ocean blue matte finish with military-grade drop protection.',
      price: 1350,
      featured: true,
      images: JSON.stringify(['https://placehold.co/600x750/eef1fe/4f6ef7?text=Ocean+Blue\\nPixel+8&font=raleway']),
      categories: { connect: [{ id: catMen.id }, { id: catAll.id }] },
    },
  });
  for (const modelName of ['Pixel 8', 'Pixel 8 Pro']) {
    await prisma.productVariant.upsert({
      where: { productId_phoneModelId: { productId: product4.id, phoneModelId: createdModels[modelName].id } },
      update: {},
      create: { productId: product4.id, phoneModelId: createdModels[modelName].id, stock: 20 },
    });
  }

  console.log('Database seeded with 4 products and variants!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
