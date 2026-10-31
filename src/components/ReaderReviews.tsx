import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Star } from "lucide-react";

type Review = {
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  quote: string;
};

const createAvatarImage = (initials: string, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${color}"/><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="32" font-weight="600">${initials}</text></svg>`,
  )}`;

const reviews: Review[] = [
  {
    name: "Tanvir Ahmed",
    role: "Avid Reader",
    initials: "TA",
    avatarColor: "#3d7661",
    quote:
      "I found rare classics right in my neighborhood. Borrowing is seamless, and it feels wonderful to discover books without searching all over town.",
  },
  {
    name: "Nusrat Jahan",
    role: "Book Club Host",
    initials: "NJ",
    avatarColor: "#98634c",
    quote:
      "Sharing finished books has helped our club connect with fellow bookworms nearby. A great way to pass a favorite story on to its next reader.",
  },
  {
    name: "Sakib Hasan",
    role: "Literature Enthusiast",
    initials: "SH",
    avatarColor: "#536d91",
    quote:
      "The simple 7-day borrowing cycle makes it easy to keep reading, and there are zero late fees. BookNook makes lending feel fair and friendly.",
  },
];

export function ReaderReviews() {
  return (
    <section
      aria-labelledby="reader-reviews-title"
      className="px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-12">
          <h2
            id="reader-reviews-title"
            className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            What Readers Are Saying
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Real stories from book lovers in your neighborhood.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <Card
              key={review.name}
              className="h-full border border-border bg-card/60 text-card-foreground backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-card/80"
            >
              <CardHeader className="flex-row items-center gap-3">
                <Avatar className="size-11 ring-2 ring-emerald-500/20">
                  <AvatarImage
                    src={createAvatarImage(review.initials, review.avatarColor)}
                    alt={`${review.name} avatar`}
                    className=""
                  />
                  <AvatarFallback className="text-xs font-semibold">
                    {review.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-card-foreground">
                    {review.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {review.role}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="">
                <div
                  aria-label="5 out of 5 stars"
                  className="mb-4 flex gap-1"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      aria-hidden="true"
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-6 text-muted-foreground">
                  “{review.quote}”
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
