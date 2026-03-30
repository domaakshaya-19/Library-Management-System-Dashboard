// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Book from "./models/Book.js";
import BookCategory from "./models/BookCategory.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding.");

    // ----- CLEAR EXISTING DATA -----
    await User.deleteMany({});
    await Book.deleteMany({});
    await BookCategory.deleteMany({});
    console.log("Cleared existing collections.");

    // ----- USERS -----
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash("password123", salt);

    const users = [
      {
        userType: "student",
        userFullName: "Demo Student",
        admissionId: "S1001",
        age: 20,
        dob: "2003-01-01",
        gender: "Female",
        address: "123 Demo Street",
        mobileNumber: "9999999999",
        email: "student@example.com",
        password: hashedPass,
        isAdmin: false,
      },
      {
        userType: "employee",
        userFullName: "Demo Employee",
        employeeId: "E1001",
        age: 30,
        dob: "1993-05-10",
        gender: "Male",
        address: "456 Employee Lane",
        mobileNumber: "8888888888",
        email: "employee@example.com",
        password: hashedPass,
        isAdmin: true,
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log("Users created.");

    // ----- BOOK CATEGORIES -----
    const categories = [
      { categoryName: "Science" },
      { categoryName: "Fiction" },
      { categoryName: "General" },
      { categoryName: "Technology" },
    ];
    const createdCategories = await BookCategory.insertMany(categories);
    console.log("Book categories created.");

    // ----- BOOKS -----
    const books = [
      {
        title: "A.P.J Abdul Kalam: Wings of Fire",
        author: "A.P.J Abdul Kalam",
        category: "Science",
        availableCopies: 5,
        coverImage: "https://images.unsplash.com/photo-1581092580493-7f52b139e7ab?auto=format&fit=crop&w=600&q=80",
        ebookUrl: "",
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        availableCopies: 3,
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        category: "General",
        availableCopies: 4,
        coverImage: "https://images.unsplash.com/photo-1581091215361-2fa4f44bb4d4?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Technology",
        availableCopies: 2,
        coverImage: "https://images.unsplash.com/photo-1555529669-4cbf37c64e21?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "1984",
        author: "George Orwell",
        category: "Fiction",
        availableCopies: 5,
        coverImage: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        availableCopies: 4,
        coverImage: "https://images.unsplash.com/photo-1544936788-89d8d45f3e5d?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Technology",
        availableCopies: 3,
        coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        availableCopies: 4,
        coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "Astrophysics for People in a Hurry",
        author: "Neil deGrasse Tyson",
        category: "Science",
        availableCopies: 2,
        coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
      },
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        category: "Technology",
        availableCopies: 5,
        coverImage: "https://images.unsplash.com/photo-1523475496153-3e70be4ff8ab?auto=format&fit=crop&w=600&q=80",
      },
    ];

    // Link books to categories
    for (let book of books) {
      const categoryDoc = await BookCategory.findOne({ categoryName: book.category });
      const newBook = new Book({
        title: book.title,
        author: book.author,
        category: book.category,
        availableCopies: book.availableCopies,
        coverImage: book.coverImage,
        ebookUrl: book.ebookUrl || "",
        transactions: [],
      });
      const savedBook = await newBook.save();
      await BookCategory.findByIdAndUpdate(categoryDoc._id, { $push: { books: savedBook._id } });
    }

    console.log("Books inserted and linked to categories.");
    mongoose.disconnect();
    console.log("Seeding complete. MongoDB disconnected.");
  } catch (err) {
    console.log("Error seeding DB:", err);
  }
};

seedDatabase();