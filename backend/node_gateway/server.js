import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();

const PROTO_PATH = "./protos/library.proto";

// Load the proto file dynamically
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const libraryProto = grpc.loadPackageDefinition(packageDefinition).library;

// Create gRPC client
const client = new libraryProto.LibraryService(
  `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

const app = express();
app.use(express.json());
app.use(cors());

// ------------------- BOOK ROUTES -------------------

// Create a new book
app.post("/books", (req, res) => {
  client.CreateBook(req.body, (err, response) => {
    if (err) return res.status(500).json({ error: err.details || err.message });
    res.json(response);
  });
});

// List all books
app.get("/books", (req, res) => {
  client.ListBooks({}, (err, response) => {
    if (err) return res.status(500).json({ error: err.details || err.message });
    res.json(response.books); // return the array of books
  });
});

// 🆕 Update book
app.put("/books/:id", (req, res) => {
  const grpcRequest = {
    id: Number(req.params.id),
    title: req.body.title,
    author: req.body.author,
  };
  client.UpdateBook(grpcRequest, (err, response) => {
    if (err) {
      console.error("UpdateBook error:", err);
      return res.status(500).json({ error: err.details || err.message });
    }
    res.json(response);
  });
});

// 🆕 Delete book (only if available)
app.delete("/books/:id", (req, res) => {
  const grpcRequest = { id: Number(req.params.id) };
  client.DeleteBook(grpcRequest, (err) => {
    if (err) {
      console.error("DeleteBook error:", err);
      return res.status(400).json({ error: err.details || err.message });
    }
    res.json({ success: true });
  });
});

// Borrow a book
app.post("/borrow", (req, res) => {
  //console.log("Borrowing:", req.body);

  // With proto-loader, we can just send a plain object
  const grpcRequest = {
    book_id: Number(req.body.book_id),
    member_id: Number(req.body.member_id),
  };

  client.BorrowBook(grpcRequest, (err, response) => {
    if (err) {
      console.error("gRPC error:", err);
      return res.status(500).json({ error: err.details || "Borrow failed" });
    }
    res.json({ success: true });
  });
});

// ------------------- MEMBER ROUTES -------------------

// Add new member
app.post("/members", (req, res) => {
  const grpcRequest = { name: req.body.name, contact: req.body.contact };
  client.AddMember(grpcRequest, (err, response) => {
    if (err) return res.status(500).json({ error: err.details || err.message });
    res.json(response);
  });
});

// List all members
app.get("/members", (req, res) => {
  client.ListMembers({}, (err, response) => {
    if (err) return res.status(500).json({ error: err.details || err.message });
    res.json(response.members);
  });
});

// Update member
app.put("/members/:id", (req, res) => {
  const grpcRequest = {
    id: Number(req.params.id),
    name: req.body.name,
    contact: req.body.contact,
  };
  client.UpdateMember(grpcRequest, (err, response) => {
    if (err) {
      console.error("UpdateBook error:", err);
      return res.status(500).json({ error: err.details || err.message });
    }
    res.json(response);
  });
});

// Delete member
app.delete("/members/:id", (req, res) => {
  const grpcRequest = { id: Number(req.params.id) };
  client.DeleteMember(grpcRequest, (err) => {
    if (err) return res.status(500).json({ error: err.details });
    res.json({ success: true });
  });
});


// List all borrowed books
app.get("/borrowed", (req, res) => {
  client.ListBorrowedBooks({}, (err, response) => {
    console.error("Error calling ListBorrowedBooks:", err);
    if (err) return res.status(500).json({ error: err.details || err.message });
    res.json(response.borrowed_books);
  });
});

// Return a borrowed book
app.post("/return", (req, res) => {
  const grpcRequest = { borrowing_id: Number(req.body.borrowing_id) };
  client.ReturnBook(grpcRequest, (err) => {
    if (err) return res.status(500).json({ error: err.details || err.message });
    res.json({ success: true });
  });
});

// List all available books
app.get("/availablebooks", (req, res) => {
  client.ListAvailableBooks({}, (err, response) => {
    if (err) return res.status(500).json({ error: err.details || err.message });
    res.json(response.books); // return the array of books
  });
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Gateway running on port ${process.env.PORT}`)
);
