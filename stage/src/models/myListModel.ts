import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const MyListItemSchema = new Schema({
    userId: { type: String, required: true },
    contentId: { type: String, required: true },
    contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
},
{
    timestamps: { createdAt: 'createdAt' },    
    collection: 'mylists',
});

//Index 
MyListItemSchema.index({ userId: 1, contentId: 1 }, { unique: true });
MyListItemSchema.index({ userId: 1, createdAt: -1 });

export const MyListItemModel = mongoose.model('MyListItem', MyListItemSchema);