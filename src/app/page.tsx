import Banner from "@/components/banner";
import { LibraryFAQ } from "@/components/LibraryFAQ";
import { ReaderReviews } from "@/components/ReaderReviews";

export default function Home() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <Banner />
      <ReaderReviews />
      <LibraryFAQ />
    </main>
  );
}
