"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    question: "How long can I keep a borrowed book?",
    answer:
      "You can keep any book for up to 7 days. If no other member has queued for it, you can easily request a renewal directly from your dashboard.",
  },
  {
    question: "Is there any membership or borrowing fee?",
    answer:
      "No, BookNook is completely free and community-driven. Our goal is to make reading accessible to everyone without subscription costs or hidden fees.",
  },
  {
    question: "What happens if a book is damaged or lost?",
    answer:
      "We operate on mutual trust. If an accident occurs, we encourage members to replace the book with a matching copy or coordinate directly with the owner.",
  },
  {
    question: "Can I list my own books for lending?",
    answer:
      "Yes! Add books from your shelf to your profile with a quick photo and description. Nearby readers can then send borrow requests.",
  },
];

export function LibraryFAQ() {
  return (
    <section
      aria-labelledby="library-faq-title"
      className="px-4 pb-20 pt-4 sm:px-6 sm:pb-24"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center sm:mb-10">
          <h2
            id="library-faq-title"
            className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Everything you need to know about borrowing and lending.
          </p>
        </div>

        <Accordion
          multiple={false}
          className="rounded-xl border border-border bg-card/60 px-5 backdrop-blur sm:px-7"
        >
          {questions.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`question-${index + 1}`}
              className="border-border"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-medium text-card-foreground hover:no-underline sm:text-base">
                {question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-6 text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
