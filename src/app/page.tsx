import Banner from "@/components/banner";
import { LibraryFAQ } from "@/components/home/LibraryFAQ";
import { ReaderReviews } from "@/components/home/ReaderReviews";
import NewArrivals from "@/components/home/NewArrivals";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <Banner />
      <NewArrivals />
      <ReaderReviews />
      <LibraryFAQ />
    </main>
  );
}
