import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BORROWS_API_URL =
  process.env.BORROWS_API_URL || "http://localhost:8000/borrows";
const BOOKS_API_URL =
  process.env.BOOKS_API_URL || "http://localhost:8000/books";

function getBorrowList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.borrows)) {
    return payload.borrows;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return null;
}

export async function GET(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in to check your borrowed books." },
      { status: 401 },
    );
  }

  const bookId = new URL(request.url).searchParams.get("bookId");
  const backendUrl = new URL(BORROWS_API_URL);
  backendUrl.searchParams.set("email", session.user.email);

  try {
    const response = await fetch(backendUrl, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not check your borrowed books." },
        { status: response.status === 401 || response.status === 403 ? response.status : 502 },
      );
    }

    const borrows = getBorrowList(await response.json());

    if (!borrows) {
      return NextResponse.json(
        { message: "The borrow server returned invalid data." },
        { status: 502 },
      );
    }

    const userEmail = session.user.email.trim().toLowerCase();
    const userBorrows = borrows.filter((borrow) => {
      const borrowerEmail = borrow?.userEmail ?? borrow?.email;
      return (
        typeof borrowerEmail === "string" &&
        borrowerEmail.trim().toLowerCase() === userEmail
      );
    });

    const bookBorrows = bookId
      ? userBorrows.filter((borrow) => String(borrow?.bookId) === bookId)
      : userBorrows;

    let availableCopies;
    if (bookId) {
      const bookResponse = await fetch(
        `${BOOKS_API_URL}/${encodeURIComponent(bookId)}`,
        { cache: "no-store" },
      );

      if (!bookResponse.ok) {
        return NextResponse.json(
          { message: "Could not check this book's availability." },
          { status: 502 },
        );
      }

      const book = await bookResponse.json();
      const inventory = Number(
        book.availableCopies ?? book.copiesLeft ?? book.totalCopies,
      );

      if (!Number.isFinite(inventory)) {
        return NextResponse.json(
          { message: "The book server returned invalid availability data." },
          { status: 502 },
        );
      }

      availableCopies = inventory;
    }

    return NextResponse.json({
      borrows: bookBorrows,
      alreadyBorrowed: bookBorrows.length > 0,
      ...(availableCopies === undefined ? {} : { availableCopies }),
    });
  } catch {
    return NextResponse.json(
      { message: "Could not connect to the borrow server." },
      { status: 502 },
    );
  }
}

export async function POST(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in to borrow a book." },
      { status: 401 },
    );
  }

  let borrow;
  try {
    borrow = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The borrow request is invalid." },
      { status: 400 },
    );
  }

  if (
    !borrow ||
    typeof borrow !== "object" ||
    Array.isArray(borrow) ||
    typeof borrow.bookId !== "string"
  ) {
    return NextResponse.json(
      { message: "The borrow request is invalid." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(BORROWS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...borrow,
        userName: session.user.name,
        userEmail: session.user.email,
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

export async function DELETE(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { message: "Please log in to return a book." },
      { status: 401 },
    );
  }

  let borrowId;
  try {
    const body = await request.json();
    borrowId = body?.borrowId;
  } catch {
    return NextResponse.json(
      { message: "The borrow ID is invalid." },
      { status: 400 },
    );
  }

  if (typeof borrowId !== "string" || !/^[a-f\d]{24}$/i.test(borrowId)) {
    return NextResponse.json(
      { message: "The borrow ID is invalid." },
      { status: 400 },
    );
  }

  try {
    const listUrl = new URL(BORROWS_API_URL);
    listUrl.searchParams.set("email", session.user.email);
    const listResponse = await fetch(listUrl, { cache: "no-store" });

    if (!listResponse.ok) {
      return NextResponse.json(
        { message: "Could not verify this borrow record." },
        { status: listResponse.status === 401 || listResponse.status === 403 ? listResponse.status : 502 },
      );
    }

    const borrows = getBorrowList(await listResponse.json());

    if (!borrows) {
      return NextResponse.json(
        { message: "The borrow server returned invalid data." },
        { status: 502 },
      );
    }

    const borrow = borrows.find(
      (item) => String(item?._id ?? item?.id ?? item?.borrowId) === borrowId,
    );
    const ownerEmail = borrow?.userEmail ?? borrow?.email;

    if (
      !borrow ||
      typeof ownerEmail !== "string" ||
      ownerEmail.trim().toLowerCase() !== session.user.email.toLowerCase()
    ) {
      return NextResponse.json(
        { message: "Borrow record not found." },
        { status: 404 },
      );
    }

    const response = await fetch(
      `${BORROWS_API_URL}/${encodeURIComponent(borrowId)}`,
      { method: "DELETE" },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not return this book. Please try again." },
        { status: response.status >= 500 ? 502 : response.status },
      );
    }

    let result;
    try {
      result = await response.json();
    } catch {
      return NextResponse.json(
        { message: "The borrow server returned an invalid response." },
        { status: 502 },
      );
    }

    if (result?.deletedCount !== 1) {
      return NextResponse.json(
        { message: "This book was already returned or no longer exists." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Could not connect to the borrow server. Please try again." },
      { status: 502 },
    );
  }
}
