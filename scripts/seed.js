const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

const created = {};

const cleanupOldData = async (client) => {
  console.log("  Cleaning Old Data");
  await client.sql`DROP TABLE IF EXISTS group3_reviews;`;
  await client.sql`DROP TABLE IF EXISTS group3_product_images;`;
  await client.sql`DROP TABLE IF EXISTS group3_product_categories;`;
  await client.sql`DROP TABLE IF EXISTS group3_category_pictures;`;
  await client.sql`DROP TABLE IF EXISTS group3_products;`;
  await client.sql`DROP TABLE IF EXISTS group3_categories;`;
  await client.sql`DROP TABLE IF EXISTS group3_users;`;
}

const seedCategories = async (client) => {
  console.log("  Seeding Categories");

  await client.sql`
    CREATE TABLE IF NOT EXISTS group3_categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  const categories = ["Candles", "Jewelry", "Pottery", "Textiles", "Paintings", "Music"];

  const createdCategories = await Promise.all(categories.map(async (name) => {
    const result = await client.sql`
      INSERT INTO group3_categories (name)
      VALUES (${name})
      RETURNING *;
    `;
    const [insertedCategory] = result.rows;
    console.log(`    - Created category: ${insertedCategory.name} (${insertedCategory.id})`);
    return insertedCategory;
  }));

  created.categories = createdCategories;

  return;
}


const seedCategoryPictures = async (client) => {
  console.log("  Seeding Category Pictures");

  // Create table
  await client.sql`
    CREATE TABLE IF NOT EXISTS group3_category_pictures (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      src VARCHAR(255) NOT NULL,
      category_id UUID NOT NULL,
      FOREIGN KEY (category_id) REFERENCES group3_categories(id)
    );
  `;

  // Picture sources for each category
  const categoryPictures = [
    { src: "https://images.pexels.com/photos/1721096/pexels-photo-1721096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", categoryName: "Candles" },
    { src: "https://images.pexels.com/photos/15871491/pexels-photo-15871491/free-photo-of-wedding-ring-with-a-diamond.jpeg", categoryName: "Jewelry" },
    { src: "https://images.pexels.com/photos/3094035/pexels-photo-3094035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", categoryName: "Pottery" },
    { src: "https://images.pexels.com/photos/3778061/pexels-photo-3778061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", categoryName: "Textiles" },
    { src: "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", categoryName: "Paintings" },
    { src: "https://images.pexels.com/photos/3971983/pexels-photo-3971983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", categoryName: "Music" }
  ];

  // Fetch categories and their IDs
  const categories = await client.sql`SELECT id, name FROM group3_categories;`;
  const categoryMap = categories.rows.reduce((map, category) => {
    map[category.name] = category.id;
    return map;
  }, {});

  // Insert pictures
  const createdPictures = await Promise.all(categoryPictures.map(async ({ src, categoryName }) => {
    const categoryId = categoryMap[categoryName];
    if (categoryId) {
      const result = await client.sql`
        INSERT INTO group3_category_pictures (src, category_id)
        VALUES (${src}, ${categoryId})
        RETURNING *;
      `;
      const [insertedPicture] = result.rows;
      console.log(`    - Created category picture: ${insertedPicture.category_id}`);
      return insertedPicture;
    } else {
      console.error(`    - Category not found: ${categoryName}`);
      return null;
    }
  }));

  return createdPictures.filter(picture => picture !== null);
};


const seedUsers = async (client) => {
  console.log("  Seeding Users");
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

  await client.sql`
      CREATE TABLE IF NOT EXISTS group3_users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        description TEXT,
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
  const users = [
    {
      firstName: "Matt",
      lastName: "Hummer",
      email: "matt@example.com",
      image: "https://picsum.photos/300/300",
    },
    {
      firstName: "Jan",
      lastName: "Levinson",
      email: "jan@example.com",
      image: "https://picsum.photos/300/300",
    },
    {
      firstName: "Michael",
      lastName: "Scott",
      email: "michael@example.com",
      image: "https://picsum.photos/300/300",
    },
  ];

  const createdUsers = await Promise.all(users.map(async (user) => {
    const hashedPassword = await bcrypt.hash("password", 10);
    const result = await client.sql`
        INSERT INTO group3_users (first_name, last_name, email, password_hash, profile_image)
        VALUES (${user.firstName}, ${user.lastName}, ${user.email}, ${hashedPassword}, ${user.image})
        RETURNING *;
      `;
    const [insertedUser] = result.rows;
    console.log(`    - Created user: ${user.firstName} ${user.lastName} (${insertedUser.id})`);
    return insertedUser;
  }));

  created.users = createdUsers;

  return;
}

const seedProducts = async (client) => {
  console.log("  Seeding Products");
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
  await client.sql`
      CREATE TABLE IF NOT EXISTS group3_products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        seller_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (seller_id) REFERENCES group3_users(id)
      );
    `;
  await client.sql`
      CREATE TABLE IF NOT EXISTS group3_product_images (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        product_id UUID NOT NULL,
        src VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (product_id) REFERENCES group3_products(id)
      );
    `;

  const products = [
    {
      name: "Vanilla Dream Candle",
      price: 150,
      descripion: "Indulge in the luxurious aroma of Vanilla Dream, where creamy vanilla notes intertwine with whispers of delicate florals, enveloping your space in an enchanting ambiance of elegance and tranquility. Elevate your senses and adorn your surroundings with the essence of opulence, as Vanilla Dream casts a sophisticated spell of warmth and sophistication.",
      sellerIndex: 1,
      images: [
        "https://i5.walmartimages.com/asr/02111a4f-4152-479e-84e5-6d041784c882_1.8024209556070c8bcf41823a02f017fa.jpeg",
        "https://images.prismic.io/bareblends/4becbce8-cc6e-4292-a25c-93d6136a5df7_vanilla+bean+hero.jpg",
      ],
    },
    {
      name: "Lavender Fields Candle",
      price: 10,
      descripion: "Transport your senses to the rolling hills of Provence with Lavender Fields, where the essence of freshly bloomed lavender dances gracefully upon a gentle breeze, infusing your sanctuary with an air of refined serenity. Immerse yourself in the epitome of sophistication as Lavender Fields envelops your space, inviting you to luxuriate in moments of pure indulgence and relaxation.",
      sellerIndex: 1,
      images: [
        "https://www.pagangrimoire.com/wp-content/uploads/2020/05/Purple-Candle-Meaning-1200x800.jpg",
        "https://worldoffloweringplants.com/wp-content/uploads/2017/11/Lavandula-angustifolia-English-Lavender1.jpg",
      ],
    },
    {
      name: "Campfire Nights Candle",
      price: 30,
      descripion: "Embark on an olfactory journey reminiscent of sophisticated evenings under the stars with Campfire Nights, where smoky notes of crackling birchwood intertwine with hints of spicy cedar, evoking memories of opulent outdoor escapades. Embrace the allure of refined rusticity as Campfire Nights casts a luxurious glow, inviting you to bask in the warmth of its elegant ambiance.",
      sellerIndex: 1,
      images: [
        "https://i.etsystatic.com/26990167/r/il/0426e3/3055778669/il_fullxfull.3055778669_mstg.jpg",
      ],
    },
    {
      name: "Cherry Blossom Candle",
      price: 30,
      descripion: "Immerse yourself in the exquisite fragrance of Cherry Blossom, where each delicate note unveils a symphony of floral opulence, transforming any space into a sanctuary of refined tranquility and sophistication. Let the essence of Cherry Blossom elevate your surroundings with its subtle yet captivating allure, inviting you to luxuriate in moments of sheer indulgence and understated elegance.",
      sellerIndex: 1,
      images: [
        "https://www.godsavethepoints.com/wp-content/uploads/2018/09/57911622_m.jpg",
      ],
    },
    {
      name: "Hunter's Track",
      price: 15,
      descripion: "A homemade album of a former secret lover",
      sellerIndex: 1,
      images: [],
    },
  ];

  const createdProducts = await Promise.all(products.map(async (product) => {
    const sellerId = created.users[product.sellerIndex].id;
    const result = await client.sql`
      INSERT INTO group3_products (name, price, description, seller_id)
      VALUES (${product.name}, ${product.price}, ${product.descripion}, ${sellerId})
      RETURNING *;
    `;
    const [insertedProduct] = result.rows;
    const pId = insertedProduct.id;
    await Promise.all(product.images.map(async (src) => {
      await client.sql`
        INSERT INTO group3_product_images (src, product_id)
        VALUES (${src}, ${pId})
        RETURNING *;
      `;
    }));

    console.log(`    - Created product: ${insertedProduct.name} (${pId})`);
    return insertedProduct;
  }));

  created.products = createdProducts;
}

const seedProductCategories = async (client) => {
  console.log("  Seeding Product Categories");

  await client.sql`
    CREATE TABLE IF NOT EXISTS group3_product_categories (
      product_id UUID NOT NULL,
      category_id UUID NOT NULL,
      PRIMARY KEY (product_id, category_id),
      FOREIGN KEY (product_id) REFERENCES group3_products(id),
      FOREIGN KEY (category_id) REFERENCES group3_categories(id)
    );
  `;

  // Mapping of product names to corresponding category names
  const productCategories = {
    "Vanilla Dream Candle": ["Candles"],
    "Lavender Fields Candle": ["Candles"],
    "Campfire Nights Candle": ["Candles"],
    "Cherry Blossom Candle": ["Candles"],
    "Hunter's Track": ["Music"],
  };

  // Insert product-category associations
  for (const productName in productCategories) {
    const product = created.products.find((p) => p.name === productName);
    if (product) {
      const categories = productCategories[productName];
      for (const categoryName of categories) {
        const category = created.categories.find((c) => c.name === categoryName);
        if (category) {
          await client.sql`
            INSERT INTO group3_product_categories (product_id, category_id)
            VALUES (${product.id}, ${category.id});
          `;
          console.log(`    - Associated product "${productName}" with category "${categoryName}"`);
        } else {
          console.error(`Category "${categoryName}" not found for product "${productName}"`);
        }
      }
    } else {
      console.error(`Product "${productName}" not found`);
    }
  }

  console.log("ProductCategories seeding completed");

  return;
}

const seedReviews = async (client) => {
  console.log("  Seeding Reviews");
  const reviewerId = created.users[2].id;
  const textOptions = [
    "You miss 100% of the shots you don’t take.",
    "Do I need to be liked? Absolutely not. I like to be liked. I enjoy being liked. I have to be liked. But it’s not like this compulsive need like my need to be praised.",
    "That has sort of an oak-y afterbirth.",
    "I’m an early bird and I’m a night owl so I’m wise and I have worms.",
    "The worst thing about prison was the Dementors. They were flying all over the place and they were scary and they'd come down and they'd suck the soul out of your body and it hurt!",
    "And I knew exactly what to do. But in a much more real sense, I had no idea what to do.",
    "I love inside jokes. I hope to be a part of one someday.",
    "You cheated on me?....When I specifically asked you not to?",
    "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.",
  ];
  const min = 1;
  const max = 5;
  await client.sql`
      CREATE TABLE IF NOT EXISTS group3_reviews (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        product_id UUID NOT NULL,
        reviewer_id UUID NOT NULL,
        stars INT NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (product_id) REFERENCES group3_products(id),
        FOREIGN KEY (reviewer_id) REFERENCES group3_users(id)
      );
    `;
  const createdReviews = await Promise.all(created.products.map(async (product) => {
    const stars = Math.floor(Math.random() * (max - min) + min);
    const text = textOptions[Math.floor(Math.random() * textOptions.length)];
    await client.sql`
      INSERT INTO group3_reviews (reviewer_id, product_id, stars, text)
      VALUES (${reviewerId}, ${product.id}, ${stars}, ${text})
      RETURNING *;
    `;
  }));
  console.log(`    - Created  ${createdReviews.length} reviews`);
  created.reviews = createdReviews;
}

const main = async () => {
  const client = await db.connect();
  console.log("Seeding Database");
  try {
    await cleanupOldData(client);
    await seedCategories(client);
    await seedCategoryPictures(client);
    await seedUsers(client);
    
    await seedProducts(client);
    await seedProductCategories(client);
    await seedReviews(client);
  } finally {
    client.end();
  }
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
