import Banner from "@/components/banner";
import Navbar from "@/components/navbar";
import { LibraryFAQ } from "@/components/LibraryFAQ";
import { ReaderReviews } from "@/components/ReaderReviews";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="dark min-h-screen bg-background text-foreground">
        <Banner />
        <ReaderReviews />
        <LibraryFAQ />
      </main>
    </>
  );
}
