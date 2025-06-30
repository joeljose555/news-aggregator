import mongoose from 'mongoose';

const newsSummariesSchema = new mongoose.Schema({
    summary: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('NewsSummaries', newsSummariesSchema);