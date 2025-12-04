import 'dotenv/config';
import * as mongoose from 'mongoose';
import { Genre, User, Movie, TVShow } from '../types/index.js'; 

//  Configuration 
const MONGO_URI = process.env.MONGODB_URI;
const MOCK_USER_ID = process.env.MOCK_USER_ID || 'user-abc-123'; 


interface MyListItemSeed {
    userId: string;
    contentId: string;
    contentType: 'Movie' | 'TVShow';
    createdAt: Date;
}

const users: User[] = [
  {
    _id: MOCK_USER_ID,
    username: 'ott_tester_1',
    preferences: {
      favoriteGenres: ['SciFi', 'Action'] as Genre[],
      dislikedGenres: ['Horror'] as Genre[],
    },
    watchHistory: [
        { contentId: 'movie-101', watchedOn: new Date('2025-10-01'), rating: 5 },
    ],
  },
];
// ... (movies and tvShows data remains the same) ...
const movies: Movie[] = [
    // ... data ...
    {
    _id: 'movie-101',
    title: 'Galactic Fury',
    description: 'A space epic where two fleets clash over a dying star.',
    genres: ['SciFi', 'Action'] as Genre[],
    releaseDate: new Date('2024-05-15'),
    director: 'Ava Johnson',
    actors: ['Chris Pine', 'Zoe Saldana'],
  },
    {
    _id: 'movie-102',
    title: 'The Unlikely Alchemist',
    description: 'A charming romantic comedy set in a medieval town.',
    genres: ['Romance', 'Comedy'] as Genre[],
    releaseDate: new Date('2023-08-20'),
    director: 'Ben Stiller',
    actors: ['Anna Kendrick', 'Ryan Reynolds'],
  },
    {
    _id: 'movie-103',
    title: 'Silent Hill',
    description: 'A psychological horror movie about a deserted town.',
    genres: ['Horror', 'Drama'] as Genre[],
    releaseDate: new Date('2022-11-01'),
    director: 'Cynthia Roth',
    actors: ['Jessica Chastain'],
  },
];
const tvShows: TVShow[] = [
    // ... data ...
    {
    _id: 'tvshow-201',
    title: 'Realm of the Dragons',
    description: 'A dark fantasy series about magic, war, and political intrigue.',
    genres: ['Fantasy', 'Drama'] as Genre[],
    episodes: [
      { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2024-01-01'), director: 'G. M. Tally', actors: ['Peter Dinklage'] },
    ],
  },
    {
    _id: 'tvshow-202',
    title: 'Laugh Track',
    description: 'A fast-paced comedy sketch show.',
    genres: ['Comedy'] as Genre[],
    episodes: [
      { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2023-01-01'), director: 'Lisa Kudrow', actors: ['Matthew Perry'] },
    ],
  },
];


//  MyList Initial Data 
const myListItems: MyListItemSeed[] = [
    {
        userId: MOCK_USER_ID,
        contentId: 'tvshow-201',
        contentType: 'TVShow',
        createdAt: new Date(Date.now() - 3600000),
    },
    {
        userId: MOCK_USER_ID,
        contentId: 'movie-103',
        contentType: 'Movie',
        createdAt: new Date(Date.now() - (86400000 * 2)),
    },
    {
        userId: MOCK_USER_ID,
        contentId: 'movie-102',
        contentType: 'Movie',
        createdAt: new Date(Date.now() - (86400000 * 5)), 
    },
];

async function seedDatabase() {
  if (!MONGO_URI) {
    console.error('MONGODB_URI is not defined in the .env File. Exiting.');
    process.exit(1);
  }
    console.log('Attempting to connect to remote MongoDB...');
  try {
    const connInstance = await mongoose.connect(MONGO_URI);
    
    console.log('Connection established.');

    // Use the captured instance to get the native database object
    const db = connInstance.connection.db;
    
    console.log('Dropping existing collections...');
    await db.collection('users').drop().catch(() => {});
    await db.collection('movies').drop().catch(() => {});
    await db.collection('tvshows').drop().catch(() => {});
    await db.collection('mylists').drop().catch(() => {}); 
    console.log('Collections cleared.');

    await db.collection('users').insertMany(users as any[]);
    console.log(`- Inserted ${users.length} users.`);
    
    await db.collection('movies').insertMany(movies as any[]);
    console.log(`- Inserted ${movies.length} movies.`);

    await db.collection('tvshows').insertMany(tvShows as any[]);
    console.log(`- Inserted ${tvShows.length} TV Shows.`);

    await db.collection('mylists').insertMany(myListItems as any[]);
    console.log(`- Inserted ${myListItems.length} initial My List items for user ${MOCK_USER_ID}.`);

    console.log('\n Database Seeding Complete! ');

  } catch (error) {
    console.error('Database Seeding Failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}
seedDatabase();