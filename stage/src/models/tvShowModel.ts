import * as mongoose from 'mongoose';
import { TVShow } from '../types/index.js';

const { Schema } = mongoose;

const EpisodeSchema = new Schema({
    episodeNumber: { type: Number, required: true },
    seasonNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: { type: [String], required: true },
}, { _id: false }); // Episodes don't need their own ID

const TVShowSchema = new Schema<TVShow>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: { type: [String], required: true },
    episodes: { type: [EpisodeSchema], required: true },
  },
  {
    versionKey: false,
    collection: 'tvshows', // Must match the MongoDB collection name
  }
);

TVShowSchema.set('id', false);

export const TVShowModel = mongoose.model<TVShow>('TVShow', TVShowSchema);