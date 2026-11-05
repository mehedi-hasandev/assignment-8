import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createBackendAccessToken } from "@/lib/createBackendAccessToken";
import { API_BASE_URL } from "@/lib/api-base-url";

const BOOKS_API_URL = `${API_BASE_URL}/books`;
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function getBookList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.books)) return payload.books;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return null;
}

async function getOwnedBook(id, email, token) {
  const url = new URL(BOOKS_API_URL);
  url.searchParams.set("email", email);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = new Error("Could not verify book ownership.");
    error.status = response.status;
    throw error;
  }

  const books = getBookList(await response.json());
  if (!books) {
    throw new Error("The book server returned invalid data.");
  }

  return books.find(
    (book) =>
      String(book?._id ?? book?.id ?? book?.bookId) === id &&
      typeof book?.userEmail === "string" &&
      book.userEmail.trim().toLowerCase() === email.trim().toLowerCase(),
  );
}

function forwardResponse(response) {
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}

async function getRequestUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function PATCH(request, { params }) {
  const user = await getRequestUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in to edit books." }, { status: 401 });
  }

  const token = createBackendAccessToken(user);

  const { id } = await params;
  if (!OBJECT_ID_PATTERN.test(id)) {
    return NextResponse.json({ message: "The book ID is invalid." }, { status: 400 });
  }

  let updates;
  try {
    updates = await request.json();
  } catch {
    return NextResponse.json({ message: "The book details are invalid." }, { status: 400 });
  }

  if (
    !updates ||
    typeof updates !== "object" ||
    Array.isArray(updates) ||
    typeof updates.title !== "string" ||
    !updates.title.trim() ||
    typeof updates.author !== "string" ||
    !updates.author.trim() ||
    typeof updates.category !== "string" ||
    !updates.category.trim() ||
    !Number.isInteger(updates.totalCopies) ||
    updates.totalCopies < 1 ||
    typeof updates.imageUrl !== "string" ||
    typeof updates.description !== "string"
  ) {
    return NextResponse.json({ message: "Please provide valid book details." }, { status: 400 });
  }

  try {
    const book = await getOwnedBook(id, user.email, token);
    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const backendUpdates = {
      ...updates,
      bookTitle: updates.title,
      authorName: updates.author,
      bookImage: updates.imageUrl,
      shortDescription: updates.description,
    };
    const response = await fetch(`${BOOKS_API_URL}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(backendUpdates),
    });
    return forwardResponse(response);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not update this book." },
      { status: error?.status === 401 || error?.status === 403 ? error.status : 502 },
    );
  }
}

export async function DELETE(_request, { params }) {
  const user = await getRequestUser();
  if (!user) {
    return NextResponse.json({ message: "Please log in to delete books." }, { status: 401 });
  }

  const token = createBackendAccessToken(user);

  const { id } = await params;
  if (!OBJECT_ID_PATTERN.test(id)) {
    return NextResponse.json({ message: "The book ID is invalid." }, { status: 400 });
  }

  try {
    const book = await getOwnedBook(id, user.email, token);
    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const response = await fetch(`${BOOKS_API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return forwardResponse(response);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not delete this book." },
      { status: error?.status === 401 || error?.status === 403 ? error.status : 502 },
    );
  }
}
