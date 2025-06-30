import RssUrl from '../models/rssUrls';
import NewsArticle from '../models/newsArticles';
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import rssUrls from '../models/rssUrls';
import { logInfo, logError, logSuccess, logWarn, logDb } from '../utils/logger';

// Configure parser to be more tolerant of malformed XML
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  timeout: 10000
});

// Alternative RSS parsing method for malformed XML
async function parseRssWithFallback(url: string) {
  try {
    // First try the standard parser
    return await parser.parseURL(url);
  } catch (error: any) {
    logWarn(`⚠️ Standard RSS parsing failed, trying alternative method for: ${url}`);
    
    try {
      // Fetch the raw XML and try to clean it
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      let xmlContent = response.data;
      
      // Basic XML cleaning - remove invalid attributes
      xmlContent = xmlContent.replace(/\s+(\w+)(?=\s|>)/g, ''); // Remove attributes without values
      xmlContent = xmlContent.replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;'); // Fix unescaped ampersands
      
      // Try parsing the cleaned XML
      return await parser.parseString(xmlContent);
    } catch (fallbackError: any) {
      logError(`❌ Alternative RSS parsing also failed:`, fallbackError, { url });
      throw fallbackError;
    }
  }
}

export async function fetchAndSaveNews() {
  try {
    // Get all RSS URLs from the database
    const rssUrls = await RssUrl.find();
    logInfo(`📰 Found ${rssUrls.length} RSS sources to process`);
    
    
    for (const rssUrlDoc of rssUrls) {
      logInfo(`📡 Processing RSS source: ${rssUrlDoc.name}`);
      
      // Process each category in the RSS source
      for (const category of rssUrlDoc.category) {
        try {
          logInfo(`  📂 Processing category: ${category.name}`, { url: category.url });
          
          // Add error handling for RSS parsing
          let feed;
          try {
            feed = await parseRssWithFallback(category.url);
          } catch (rssError: any) {
            logError(`❌ Failed to parse RSS feed for ${category.name}:`, rssError, { url: category.url });
            continue; // Skip this category and move to the next one
          }
          
          if (!feed || !feed.items || feed.items.length === 0) {
            logWarn(`   ⚠️ No items found in RSS feed for ${category.name}`);
            continue;
          }
          
          logInfo(`   📄 Found ${feed.items.length} items in RSS feed`, { category: category.name });
          
          // Process each item in the feed
          for (const item of feed.items) {
            try {
              if (!item.link) {
                logWarn(`   ⚠️ Skipping item without link: ${item.title || 'No title'}`);
                continue;
              }
              
              logInfo(`   📝 Processing article: ${item.title || 'No title'}`);
              
              const fullText = await fetchFullArticle(item.link);
              
              // Only save if we got meaningful content
              if (fullText && fullText.length > 100 && fullText !== 'No content extracted.' && fullText !== 'Failed to load article content.') {
                const newsArticle = new NewsArticle({
                  title: item.title || 'No title',
                  description: item.description || item.contentSnippet || 'No description',
                  url: item.link,
                  publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                  categoryId: category.categoryId,
                  categoryName: category.name,
                  source: rssUrlDoc.name, 
                  fullText: fullText,
                });
                
                await newsArticle.save();
                logDb('insert', 'newsArticles', { 
                  title: item.title, 
                  category: category.name, 
                  source: rssUrlDoc.name,
                });
                logSuccess(`   ✅ Saved article: ${item.title || 'No title'}`);
              } else {
                logWarn(`   ⚠️ Skipping article with insufficient content: ${item.title || 'No title'}`);
              }
              
            } catch (itemError: any) {
              logError(`   ❌ Error processing item:`, itemError, { title: item.title, url: item.link });
              continue; // Continue with next item
            }
          }
          
        } catch (categoryError: any) {
          logError(`❌ Error processing category ${category.name}:`, categoryError, { category: category.name, url: category.url });
          continue; // Continue with next category
        }
      }
    }
    
    logSuccess('✅ News fetching and saving completed.');
  } catch (err: any) {
    logError('❌ Error in fetchAndSaveNews:', err);
  }
}

const fetchFullArticle = async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove unwanted elements that might interfere with content extraction
    $('script, style, nav, header, footer, aside, .advertisement, .ads, .sidebar, .comments, .social-share, .related-articles').remove();
    
    // Strategy 1: Look for common article content selectors
    const contentSelectors = [
      // Article-specific selectors
      'article .content',
      'article .article-content',
      'article .post-content',
      'article .entry-content',
      'article .story-content',
      'article .article-body',
      'article .post-body',
      'article .content-body',
      
      // Generic content selectors
      '.content',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-content',
      '.article-body',
      '.post-body',
      '.content-body',
      '.main-content',
      '.article-text',
      '.story-text',
      
      // News-specific selectors
      '.news-content',
      '.story-content',
      '.article-content',
      '.post-content',
      
      // Fallback to article tag
      'article'
    ];
    
    let content = '';
    let bestContent = '';
    let maxLength = 0;
    
    // Try each selector and find the one with the most content
    for (const selector of contentSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        const text = elements
          .map((_, el) => {
            // Get all text content, including nested elements
            return $(el).text().trim();
          })
          .get()
          .join('\n')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (text.length > maxLength && text.length > 100) {
          maxLength = text.length;
          bestContent = text;
        }
      }
    }
    
    // Strategy 2: If no good content found, try paragraph-based extraction
    if (!bestContent || bestContent.length < 200) {
      const paragraphs = $('p')
        .map((_, el) => {
          const text = $(el).text().trim();
          // Filter out short paragraphs that are likely navigation or ads
          return text.length > 50 ? text : '';
        })
        .get()
        .filter(text => text.length > 0);
      
      if (paragraphs.length > 0) {
        bestContent = paragraphs.join('\n\n');
      }
    }
    
    // Strategy 3: Extract from main content area
    if (!bestContent || bestContent.length < 200) {
      const mainSelectors = ['main', '#main', '.main', '#content', '.content'];
      for (const selector of mainSelectors) {
        const mainElement = $(selector);
        if (mainElement.length > 0) {
          const text = mainElement.text().trim().replace(/\s+/g, ' ');
          if (text.length > maxLength) {
            maxLength = text.length;
            bestContent = text;
          }
        }
      }
    }
    
    // Strategy 4: Look for structured data (JSON-LD)
    const jsonLdScripts = $('script[type="application/ld+json"]');
    if (jsonLdScripts.length > 0 && (!bestContent || bestContent.length < 200)) {
      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const jsonData = JSON.parse($(jsonLdScripts[i]).html() || '{}');
          if (jsonData.articleBody || jsonData.description) {
            const structuredContent = jsonData.articleBody || jsonData.description;
            if (structuredContent.length > bestContent.length) {
              bestContent = structuredContent;
            }
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
    }
    
    // Clean up the extracted content
    if (bestContent) {
      content = bestContent
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\n\s*\n/g, '\n') // Remove excessive line breaks
        .trim();
    }
    
    // Final fallback: extract all text from body
    if (!content || content.length < 100) {
      content = $('body')
        .text()
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 5000); // Limit to first 5000 characters
    }
    
    return content || 'No content extracted.';
  } catch (err: any) {
    logError(`❌ Error fetching article from ${url}:`, err);
    return 'Failed to load article content.';
  }
};

// Example usage (uncomment to run directly)
// fetchAndSaveNews();
