import mongoose from 'mongoose';

const rssUrlSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
    category:[
        {
            name: {
                type: String,
                required: true
            },
            categoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
},{
    timestamps: true
})

export default mongoose.model('RssUrl', rssUrlSchema);