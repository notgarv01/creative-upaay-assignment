import bcrypt from 'bcryptjs';
import { Movie } from '../models/Movie.model.js';
import { Theatre } from '../models/Theatre.model.js';
import { Schedule } from '../models/Schedule.model.js';
import { User } from '../models/User.model.js';

const moviesData = [
  {
    title: "Meg 2: The Trench",
    genres: ["Action", "Sci-fi", "Horror"],
    synopsis: "A research team encounters multiple threats while exploring the depths of the ocean, including a malevolent mining operation.",
    score: 5.1,
    pgRating: "PG-13",
    releaseDate: "10 June 2026",
    formats: ["2D", "3D"],
    cast: [
      { name: "Jason Statham", role: "Jonas Taylor", imageUrl: "/images/cast_jason.png" },
      { name: "Jing Wu", role: "Jiuming Zhang", imageUrl: "/images/cast_jing.png" },
      { name: "Shuya Sophia Cai", role: "Meiying", imageUrl: "/images/cast_shuya.png" }
    ],
    posterImage: "/images/home_movie_meg2.png",
    bannerImage: "/images/detail_hero.png",
    status: "now"
  },
  {
    title: "The Nun II",
    genres: ["Horror", "Mystery", "Thriller"],
    synopsis: "1956 – France. A priest is murdered. An evil is spreading. The sister sister Irene once again comes face-to-face with Valak, the demon nun.",
    score: 6.8,
    pgRating: "R",
    releaseDate: "08 September 2023",
    formats: ["2D"],
    cast: [
      { name: "Taissa Farmiga", role: "Sister Irene", imageUrl: "/images/cast_jason.png" },
      { name: "Storm Reid", role: "Sister Debra", imageUrl: "/images/cast_jing.png" }
    ],
    posterImage: "/images/home_movie_nun2.png",
    bannerImage: "/images/detail_hero.png",
    status: "now"
  },
  {
    title: "Fast X",
    genres: ["Action", "Adventure", "Thriller"],
    synopsis: "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.",
    score: 7.2,
    pgRating: "PG-13",
    releaseDate: "19 May 2023",
    formats: ["2D", "3D"],
    cast: [
      { name: "Vin Diesel", role: "Dom Toretto", imageUrl: "/images/cast_jason.png" },
      { name: "Michelle Rodriguez", role: "Letty Ortiz", imageUrl: "/images/cast_jing.png" }
    ],
    posterImage: "/images/home_movie_fastx.png",
    bannerImage: "/images/detail_hero.png",
    status: "now"
  },
  {
    title: "John Wick: Chapter 4",
    genres: ["Action", "Thriller"],
    synopsis: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.",
    score: 8.4,
    pgRating: "R",
    releaseDate: "24 March 2023",
    formats: ["2D"],
    cast: [
      { name: "Keanu Reeves", role: "John Wick", imageUrl: "/images/cast_jason.png" },
      { name: "Donnie Yen", role: "Caine", imageUrl: "/images/cast_jing.png" }
    ],
    posterImage: "/images/home_movie_johnwick4.png",
    bannerImage: "/images/detail_hero.png",
    status: "now"
  }
];

const theatresData = [
  {
    name: "The Grandview",
    location: "Camp Aguinaldo, Quezon City",
    logo: "/images/theater_logo_1.png",
    minPrice: 320,
    maxPrice: 450
  },
  {
    name: "Play Loft",
    location: "Aurora Boulevard, Santa Mesa",
    logo: "/images/theater_logo_2.png",
    minPrice: 300,
    maxPrice: 430
  },
  {
    name: "CinemaOne",
    location: "A Cruz, Pasay City",
    logo: "/images/theater_logo_3.png",
    minPrice: 280,
    maxPrice: 410
  },
  {
    name: "Cinemount",
    location: "Baclaran, Paranaque City",
    logo: "/images/theater_logo_4.png",
    minPrice: 350,
    maxPrice: 350
  }
];

export async function seedDatabase() {
  try {
    const movieCount = await Movie.countDocuments();
    const theatreCount = await Theatre.countDocuments();

    if (movieCount > 0 && theatreCount > 0) {
      console.log('Database already has movie and theatre data. Skipping seed.');
      return;
    }

    // Clear existing data
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Schedule.deleteMany({});

    console.log('Seeding Database...');

    // Seed User (demo credential)
    const demoUserExists = await User.findOne({ email: 'demo@creativeupaay.com' });
    if (!demoUserExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Demo Candidate',
        email: 'demo@creativeupaay.com',
        password: hashedPassword
      });
      console.log('Created demo user: demo@creativeupaay.com / password123');
    }

    // Seed Movies
    const seededMovies = await Movie.insertMany(moviesData);
    console.log(`Seeded ${seededMovies.length} movies.`);

    // Seed Theatres
    const seededTheatres = await Theatre.insertMany(theatresData);
    console.log(`Seeded ${seededTheatres.length} theatres.`);

    // Seed Schedules for dates and screens
    const days = ["Fri 10", "Sat 11", "Sun 12", "Mon 13", "Tue 14", "Wed 15", "Thu 16"];
    const screens = ["Screen 1", "Screen 2"];
    const times = ["10:00 AM", "12:00 PM", "4:00 PM", "6:00 PM"];

    const schedulesToInsert = [];

    for (const movie of seededMovies) {
      for (const theatre of seededTheatres) {
        for (const day of days) {
          for (const format of movie.formats) {
            for (const screen of screens) {
              for (const time of times) {
                // Determine screen baseline price
                const basePrice = theatre.minPrice + (screen === "Screen 2" ? 30 : 0) + (format === "3D" ? 50 : 0);
                
                // Some default pre-occupied seats matching mockup (e.g. H7, H8, H9, H10, J11, J12)
                let occupied = [];
                if (day === "Fri 10" && screen === "Screen 1" && time === "10:00 AM") {
                  occupied = ["H-7", "H-8", "H-9", "H-10", "J-11", "J-12"];
                }

                schedulesToInsert.push({
                  movieId: movie._id,
                  theatreId: theatre._id,
                  date: day,
                  format: format,
                  screen: screen,
                  time: time,
                  price: basePrice,
                  occupiedSeats: occupied
                });
              }
            }
          }
        }
      }
    }

    await Schedule.insertMany(schedulesToInsert);
    console.log(`Seeded ${schedulesToInsert.length} schedule entries.`);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
