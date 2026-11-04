import AddBookForm from "@/app/add-books/form";
import { requireUser } from "@/lib/require-user";

export default async function AddBooksPage() {
  await requireUser("/add-books");

  return <AddBookForm />;
}
