export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

interface Episode {
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
}

export interface TVShow {
    _id: string; // Unique ID for the TV Show
    title: string;
    description: string;
    genres: Genre[];
    episodes: Episode[]; 
}

export interface Movie {
    _id: string; // Unique ID for the Movie
    title: string;
    description: string;
    genres: Genre[];
    releaseDate: Date;
    director: string;
    actors: string[];
}

interface WatchHistoryItem {
    contentId: string;
    watchedOn: Date;
    rating?: number;
}

export interface User {
    _id: string;
    username: string;
    preferences: {
        favoriteGenres: Genre[];
        dislikedGenres: Genre[];
    };
    watchHistory: WatchHistoryItem[];
}