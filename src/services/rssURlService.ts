import RssUrl from '../models/rssUrls';
import Category from '../models/categories';
import { logInfo, logError, logSuccess, logDb } from '../utils/logger';

// Category to image mapping using free Unsplash images
const categoryImageMap: { [key: string]: string } = {
  'World': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
  'Business': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
  'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
  'Science & Environment': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop',
  'Entertainment & Arts': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
  'US': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
  'Science': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=300&fit=crop',
  'Arts': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?w=400&h=300&fit=crop',
  'Politics': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
  'Environment': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  'Front Page': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
  'International': 'https://images.unsplash.com/photo-1521295121782-8a321352551d?w=400&h=300&fit=crop',
  'Economy': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
  'Culture': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
  'All News': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
  'National': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
  'Opinion': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'Top News': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
  'India': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
};

const rssSources = [
  {
    "name": "BBC News",
    "category": [
      {
        "type": "World",
        "url": "https://feeds.bbci.co.uk/news/world/rss.xml"
      },
      {
        "type": "UK",
        "url": "https://feeds.bbci.co.uk/news/uk/rss.xml"
      },
      {
        "type": "Business",
        "url": "https://feeds.bbci.co.uk/news/business/rss.xml"
      },
      {
        "type": "Technology",
        "url": "https://feeds.bbci.co.uk/news/technology/rss.xml"
      },
      {
        "type": "Science & Environment",
        "url": "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml"
      },
      {
        "type": "Entertainment & Arts",
        "url": "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"
      }
    ]
    
  },
  {
    "name": "The New York Times",
    "category": [
      {
        "type": "World",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
      },
      {
        "type": "US",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/US.xml"
      },
      {
        "type": "Business",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml"
      },
      {
        "type": "Technology",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"
      },
      {
        "type": "Science",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml"
      },
      {
        "type": "Arts",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml"
      }
    ]
  },
  {
    "name": "Reuters",
    "category": [
      {
        "type": "World",
        "url": "https://feeds.reuters.com/Reuters/worldNews"
      },
      {
        "type": "Business",
        "url": "https://feeds.reuters.com/reuters/businessNews"
      },
      {
        "type": "Technology",
        "url": "https://feeds.reuters.com/reuters/technologyNews"
      },
      {
        "type": "Politics",
        "url": "https://feeds.reuters.com/Reuters/PoliticsNews"
      },
      {
        "type": "Environment",
        "url": "https://feeds.reuters.com/reuters/environment"
      }
    ]
  },
  {
    "name": "The Guardian",
    "category": [
      {
        "type": "World",
        "url": "https://www.theguardian.com/world/rss"
      },
      {
        "type": "Technology",
        "url": "https://www.theguardian.com/uk/technology/rss"
      },
      {
        "type": "Environment",
        "url": "https://www.theguardian.com/environment/rss"
      }
    ]
  },
  {
    "name": "Le Monde",
    "category": [
      {
        "type": "Front Page",
        "url": "https://www.lemonde.fr/rss/une.xml"
      },
      {
        "type": "International",
        "url": "https://www.lemonde.fr/international/rss_full.xml"
      },
      {
        "type": "Economy",
        "url": "https://www.lemonde.fr/economie/rss_full.xml"
      },
      {
        "type": "Culture",
        "url": "https://www.lemonde.fr/culture/rss_full.xml"
      },
    ]
  },
  {
    "name": "The Japan Times",
    "category": [
      {
        "type": "All News",
        "url": "https://www.japantimes.co.jp/feed/"
      },
      {
        "type": "National",
        "url": "https://www.japantimes.co.jp/news_category/national/feed/"
      },
      {
        "type": "World",
        "url": "https://www.japantimes.co.jp/news_category/world/feed/"
      },
      {
        "type": "Business",
        "url": "https://www.japantimes.co.jp/news_category/business/feed/"
      },
      {
        "type": "Opinion",
        "url": "https://www.japantimes.co.jp/opinion/feed/"
      }
    ]
  },
  {
    "name": "Hindustan Times",
    "category": [
      {
        "type": "Top News",
        "url": "https://www.hindustantimes.com/rss/topnews/rssfeed.xml"
      },
      {
        "type": "India",
        "url": "https://www.hindustantimes.com/rss/india/rssfeed.xml"
      },
      {
        "type": "World",
        "url": "https://www.hindustantimes.com/rss/world/rssfeed.xml"
      },
      {
        "type": "Business",
        "url": "https://www.hindustantimes.com/rss/business/rssfeed.xml"
      }
    ]
  },
  {
    "name": "The Times of India",
    "category": [
      {
        "type": "World",
        "url": "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms"
      },
      {
        "type": "India",
        "url": "https://timesofindia.indiatimes.com/rssfeeds/-2128936834.cms"
      },
      {
        "type": "Business",
        "url": "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms"
      },
      {
        "type": "Sports",
        "url": "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms"
      }
    ]
  },
  {
    "name": "The Washington Post",
    "category": [
      {
        "type": "World",
        "url": "https://feeds.washingtonpost.com/rss/world"
      },
      {
        "type": "National",
        "url": "https://feeds.washingtonpost.com/rss/national"
      },
      {
        "type": "Politics",
        "url": "https://feeds.washingtonpost.com/rss/politics"
      },
      {
        "type": "Business",
        "url": "https://feeds.washingtonpost.com/rss/business"
      }
    ]
  },
  {
    "name": "NBC News",
    "category": [
      {
        "type": "Politics",
        "url": "https://feeds.nbcnews.com/nbcnews/public/politics-news"
      },
      {
        "type": "Business",
        "url": "https://feeds.nbcnews.com/nbcnews/public/business"
      }
    ]
  }
];

// This function will insert the above sources into the rssUrls collection
export async function getRssUrls() {
  try {
    const rssUrls = await RssUrl.find({ isActive: true });
    logDb('read', 'rssUrls', { count: rssUrls.length });
    return rssUrls;
  } catch (error) {
    logError('Error fetching RSS URLs:', error);
    return null;
  }
}

// Function to update existing categories with image URIs
export async function updateExistingCategoriesWithImages() {
    try {
        const categoriesWithoutImages = await Category.find({ 
            $or: [
                { imageUri: { $exists: false } },
                { imageUri: null },
                { imageUri: "" }
            ]
        });
        
        logInfo(`Found ${categoriesWithoutImages.length} categories without images`);
        
        for (const category of categoriesWithoutImages) {
            const imageUri = categoryImageMap[category.name] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
            await Category.findByIdAndUpdate(category._id, { imageUri });
            logInfo(`Updated category "${category.name}" with image: ${imageUri}`);
        }
        
        logSuccess(`Updated ${categoriesWithoutImages.length} categories with images`);
        return { 
            status: true,
            message: `Updated ${categoriesWithoutImages.length} categories with images`
        };
    } catch (error) {
        logError('Error updating categories with images:', error);
        return {
            status: false,
            message: 'Error updating categories with images'
        };
    }
}

export async function insertRssUrls(rssSources: any) {
    try {
        // Flatten the nested arrays and remove duplicates based on name
        const allCategories = rssSources.flatMap((source: any) => 
            source.category.map((category: any) => ({ 
                name: category.type,
                imageUri: categoryImageMap[category.type] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' // Default image
            }))
        );
        
        // Remove duplicates using a Map to preserve order
        const uniqueCategories = Array.from(
            new Map(allCategories.map((item: any) => [item.name, item])).values()
        );
        
        logInfo('Total unique categories:', { count: uniqueCategories.length });
        
        // Check which categories already exist in the database
        const existingCategories = await Category.find({
            name: { $in: uniqueCategories.map((cat: any) => cat.name) }
        });
        logInfo('Existing categories:', { count: existingCategories.length, categories: existingCategories.map(cat => cat.name) });
        
        // Update existing categories with images if they don't have them
        for (const category of existingCategories) {
            if (!category.imageUri) {
                const imageUri = categoryImageMap[category.name] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
                await Category.findByIdAndUpdate(category._id, { imageUri });
                logInfo(`Updated existing category "${category.name}" with image: ${imageUri}`);
            }
        }
        
        const existingCategoryNames = existingCategories.map((cat: any) => cat.name);
        const missingCategories = uniqueCategories.filter((cat: any) => 
            !existingCategoryNames.includes(cat.name)
        );
        
        logInfo(`Found ${existingCategories.length} existing categories`);
        logInfo(`Need to insert ${missingCategories.length} new categories`);
        
        let allCategoriesWithIds = [...existingCategories];
        
        // Insert only missing categories
        logInfo('Missing categories:', { count: missingCategories.length });
        if (missingCategories.length > 0) {
            const insertCategories = await Category.insertMany(missingCategories);
            allCategoriesWithIds = [...allCategoriesWithIds, ...insertCategories];
            logDb('insert', 'categories', { count: insertCategories.length });
            logSuccess(`Inserted ${insertCategories.length} new categories`);
        }
        
        for (const source of rssSources) {
          let categories = [];
          for (const sourceCategory of source.category) {
            let matchedCategory = allCategoriesWithIds.find((category: any) => category.name === sourceCategory.type);
            categories.push({
              name: sourceCategory.type,
              categoryId: matchedCategory?._id,
              url: sourceCategory.url
            })
          }
          const rssUrl = await RssUrl.create({
            name: source.name,
            isActive: true,
            category: categories
        });
        }
        logSuccess('RSS URLs seeding completed.');
        logDb('insert', 'rssUrls', { sources: rssSources.length });
        return { 
          status: true,
          message: 'RSS URLs seeded successfully'
        }
    } catch (error) {
        logError('Error seeding RSS URLs:', error);
        return {
          status: false,
          message: 'Error seeding RSS URLs'
        }
    }
}
