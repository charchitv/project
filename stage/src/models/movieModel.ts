import * as mongoose from 'mongoose';
import { Movie } from '../types/index.js';

const { Schema } = mongoose;

const MovieSchema = new Schema<Movie>(
  {
    // Use _id as the primary identifier, matching the seeding script
    _id: { type: String, required: true }, 
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: { type: [String], required: true },
  },
  {
    versionKey: false,
    collection: 'movies', // Must match the MongoDB collection name
  }
);

// Explicitly tell Mongoose not to use its default ObjectId behavior
MovieSchema.set('id', false); 

export const MovieModel = mongoose.model<Movie>('Movie', MovieSchema);