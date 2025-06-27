import RssUrl from '../models/rssUrls';
import Category from '../models/categories';

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
    return rssUrls;
  } catch (error) {
    console.error('Error fetching RSS URLs:', error);
  }
}
export async function insertRssUrls(rssSources: any) {
    try {
        // Flatten the nested arrays and remove duplicates based on name
        const allCategories = rssSources.flatMap((source: any) => 
            source.category.map((category: any) => ({ name: category.type }))
        );
        
        // Remove duplicates using a Map to preserve order
        const uniqueCategories = Array.from(
            new Map(allCategories.map((item: any) => [item.name, item])).values()
        );
        
        console.log('Total unique categories:', uniqueCategories.length);
        
        // Check which categories already exist in the database
        const existingCategories = await Category.find({
            name: { $in: uniqueCategories.map((cat: any) => cat.name) }
        });
        console.log('Existing categories:', existingCategories);
        const existingCategoryNames = existingCategories.map((cat: any) => cat.name);
        const missingCategories = uniqueCategories.filter((cat: any) => 
            !existingCategoryNames.includes(cat.name)
        );
        
        console.log(`Found ${existingCategories.length} existing categories`);
        console.log(`Need to insert ${missingCategories.length} new categories`);
        
        let allCategoriesWithIds = [...existingCategories];
        
        // Insert only missing categories
        console.log('Missing categories:', missingCategories.length);
        if (missingCategories.length > 0) {
            const insertCategories = await Category.insertMany(missingCategories);
            allCategoriesWithIds = [...allCategoriesWithIds, ...insertCategories];
            console.log(`Inserted ${insertCategories.length} new categories`);
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
        console.log('RSS URLs seeding completed.');
        return { 
          status: true,
          message: 'RSS URLs seeded successfully'
        }
    } catch (error) {
        console.error('Error seeding RSS URLs:', error);
        return {
          status: false,
          message: 'Error seeding RSS URLs'
        }
    }
}
