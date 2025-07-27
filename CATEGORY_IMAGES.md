# Category Images Feature

This feature adds image URIs to news categories to enhance the visual presentation of the news aggregator.

## Overview

Each category in the database now includes an `imageUri` field that points to a relevant free stock image from Unsplash. This provides visual context for different news categories.

## Database Schema Changes

### Category Model
The `Category` model has been updated to include:
```typescript
{
    name: String,        // Category name (required)
    imageUri: String,    // URL to category image (optional)
    isActive: Boolean,   // Active status (default: true)
    timestamps: true     // Created/updated timestamps
}
```

## Image Mapping

The following categories have been mapped to relevant Unsplash images:

| Category | Image URL |
|----------|-----------|
| World | Global/International news imagery |
| Business | Business/Finance imagery |
| Technology | Tech/Computing imagery |
| Science & Environment | Science/Nature imagery |
| Entertainment & Arts | Arts/Culture imagery |
| Politics | Political imagery |
| Sports | Sports imagery |
| And more... | See `categoryImageMap` in `rssURlService.ts` |

## API Endpoints

### 1. Update Existing Categories with Images
```http
PUT /api/rssUrl/updateCategoriesWithImages
```
Updates all existing categories that don't have images with relevant Unsplash images.

**Response:**
```json
{
    "status": true,
    "message": "Updated X categories with images"
}
```

### 2. Insert RSS URLs (Enhanced)
```http
POST /api/rssUrl/insertRssUrls
```
The existing endpoint now automatically assigns images to new categories during insertion.

## Usage Examples

### Update Existing Categories
```javascript
const response = await fetch('/api/rssUrl/updateCategoriesWithImages', {
    method: 'PUT'
});
const result = await response.json();
console.log(result.message);
```

### Insert New RSS Sources
```javascript
const rssSources = [
    {
        "name": "My News Source",
        "category": [
            {
                "type": "Technology",
                "url": "https://example.com/tech-feed"
            },
            {
                "type": "Business", 
                "url": "https://example.com/business-feed"
            }
        ]
    }
];

const response = await fetch('/api/rssUrl/insertRssUrls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rssSources)
});
```

## Testing

Run the test script to verify functionality:
```bash
node test-categories.js
```

## Image Sources

All images are sourced from Unsplash (https://unsplash.com), which provides free-to-use high-quality stock photos. Images are optimized for web use with parameters:
- Width: 400px
- Height: 300px  
- Fit: crop

## Default Image

If a category doesn't have a specific image mapping, it will use a default global news image:
```
https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop
```

## Implementation Details

1. **Category Model Update**: Added `imageUri` field to the schema
2. **Image Mapping**: Created `categoryImageMap` with category-to-image mappings
3. **Service Enhancement**: Updated `insertRssUrls` to include images for new categories
4. **Migration Function**: Added `updateExistingCategoriesWithImages` for existing data
5. **API Endpoint**: New PUT endpoint for updating existing categories
6. **Backward Compatibility**: Existing functionality remains unchanged

## Benefits

- **Visual Enhancement**: Categories now have relevant visual representations
- **User Experience**: Better visual hierarchy and category recognition
- **Consistency**: All categories have appropriate images
- **Performance**: Images are optimized for web delivery
- **Free Usage**: All images are free-to-use from Unsplash 