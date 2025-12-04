import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { MyListItemModel } from '../models/myListModel.js';
import { MovieModel } from '../models/movieModel.js'; 
import { TVShowModel } from '../models/tvShowModel.js';

import Joi from 'joi';

const addItemSchema = Joi.object({
  contentId: Joi.string().required(),
  contentType: Joi.string().valid('Movie', 'TVShow').required(),
});

const removeItemSchema = Joi.object({
  contentId: Joi.string().required(),
});

const listItemsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const MOCK_USER_ID = process.env.MOCK_USER_ID || 'user-abc-123';
 
/**
 * POST /api/v1/my-list/add
 * Adds a movie or TV show to the user's list, validating the content ID against the database.
 */
export const addItem = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = addItemSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    
    const { contentId, contentType } = value;
    const userId = MOCK_USER_ID; 

    try {
        let contentExists = false;

        // --- Content ID Validation Logic ---
        if (contentType === 'Movie') {
            // Find the Movie using its _id. Use .select('_id').lean() for max performance.
            const movie = await MovieModel.findById(contentId).select('_id').lean();
            contentExists = !!movie;
        } else if (contentType === 'TVShow') {
            // Find the TVShow using its _id.
            const tvShow = await TVShowModel.findById(contentId).select('_id').lean();
            contentExists = !!tvShow;
        } 
        
        if (!contentExists) {
            // Return 404 if content ID is not found in the respective collection
            res.status(404).json({ message: `${contentType} with ID ${contentId} not found.` });
            return;
        }
        // --- End Content ID Validation ---

        // If content exists, proceed to add to My List
        const newItem = new MyListItemModel({ userId, contentId, contentType });
        await newItem.save();
        res.status(201).json({ message: 'Item added successfully', data: newItem });

    } catch (err: any) {
        if (err.code === 11000) { 
            res.status(409).json({ message: 'Item is already in My List.' });
            return;
        }
        console.error('Add item error:', err);
        res.status(500).json({ message: 'Failed to add item to list.' });
    }
};


/**
 * DELETE /api/v1/my-list/remove/:contentId
 * Removes an item from the user's list using the item's unique ID.
 */
export const removeItem = async (req: Request, res: Response): Promise<void> => {
    const { error } = removeItemSchema.validate(req.params);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const { contentId } = req.params;
    const userId = MOCK_USER_ID;
    try {
        const result = await MyListItemModel.deleteOne({ userId, contentId });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Item not found in My List.' });
            return;
        }
        res.status(200).json({ message: 'Item removed successfully.' });
    } catch (err) {
        console.error('Remove item error:', err);
        res.status(500).json({ message: 'Failed to remove item.' });
    }
};

/**
 * GET /api/v1/my-list/list
 * Retrieves paginated list items along with the full content details (Movie or TVShow).
 */
export const listItems = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = listItemsSchema.validate(req.query);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const { page, limit } = value;
    const userId = MOCK_USER_ID;
    const skip = (page - 1) * limit;

    try {
        const totalItems = await MyListItemModel.countDocuments({ userId });
        const pipeline : mongoose.PipelineStage[] = [
            { $match: { userId: userId } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'movies',
                    localField: 'contentId',
                    foreignField: '_id',
                    as: 'movieDetails',
                },
            },
            {
                $lookup: {
                    from: 'tvshows',
                    localField: 'contentId',
                    foreignField: '_id',
                    as: 'tvShowDetails',
                },
            },
            {
                $addFields: {
                    content: {
                        $cond: {
                            if: { $eq: ['$contentType', 'Movie'] },
                            then: { $arrayElemAt: ['$movieDetails', 0] },
                            else: { $arrayElemAt: ['$tvShowDetails', 0] },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    listId: '$_id',
                    contentId: '$contentId',
                    contentType: '$contentType',
                    createdAt: '$createdAt',
                    contentDetails: '$content', 
                },
            },
        ];
        const items = await MyListItemModel.aggregate(pipeline).exec(); 
        res.status(200).json({
            data: items,
            meta: {
                total: totalItems,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalItems / limit),
            },
        });
    } catch (err) {
        console.error('List items error:', err);
        res.status(500).json({ message: 'Failed to retrieve list items.' });
    }
};