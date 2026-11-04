import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BOOKS_API_URL =
  process.env.BOOKS_API_URL || "http://localhost:8000/books";
const ADD_BOOKS_API_URL =
  process.env.ADD_BOOKS_API_URL ||
  new URL("/add-books", BOOKS_API_URL).toString();

export async function POST(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in to add a book." },
      { status: 401 },
    );
  }

  let book;
  try {
    book = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The book details are invalid." },
      { status: 400 },
    );
  }

  if (!book || typeof book !== "object" || Array.isArray(book)) {
    return NextResponse.json(
      { message: "The book details are invalid." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(ADD_BOOKS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...book,
        userName: session.user.name,
        userEmail: session.user.email,
        createdAt: new Date().toISOString(),
      }),
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "text/plain; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Could not connect to the book server. Please try again." },
      { status: 502 },
    );
  }
}
