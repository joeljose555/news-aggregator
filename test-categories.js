const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/rssUrl';

async function testCategoryImages() {
    try {
        console.log('🧪 Testing Category Images Functionality...\n');

        // Test 1: Update existing categories with images
        console.log('1️⃣ Updating existing categories with images...');
        const updateResponse = await axios.put(`${BASE_URL}/updateCategoriesWithImages`);
        console.log('✅ Update Response:', updateResponse.data);
        console.log('');

        // Test 2: Insert RSS URLs (this will also add images to new categories)
        console.log('2️⃣ Inserting RSS URLs with category images...');
        const rssSources = [
            {
                "name": "Test Source",
                "category": [
                    {
                        "type": "Technology",
                        "url": "https://example.com/tech"
                    },
                    {
                        "type": "Business",
                        "url": "https://example.com/business"
                    }
                ]
            }
        ];
        
        const insertResponse = await axios.post(`${BASE_URL}/insertRssUrls`, rssSources);
        console.log('✅ Insert Response:', insertResponse.data);
        console.log('');

        // Test 3: Get RSS URLs to see the results
        console.log('3️⃣ Fetching RSS URLs to verify...');
        const getResponse = await axios.get(`${BASE_URL}/getRssUrls`);
        console.log('✅ Get Response: Found', getResponse.data.length, 'RSS sources');
        
        // Show some category examples
        if (getResponse.data.length > 0) {
            const firstSource = getResponse.data[0];
            console.log('📋 Sample RSS Source:', {
                name: firstSource.name,
                categories: firstSource.category.map(cat => ({
                    name: cat.name,
                    hasImage: !!cat.categoryId
                }))
            });
        }

        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testCategoryImages(); 