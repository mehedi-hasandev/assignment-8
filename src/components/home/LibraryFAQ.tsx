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
      className="bg-[#fcf8fc] px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="max-w-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-[#702068]">
            F. A. Q
          </p>
          <h2
            id="library-faq-title"
            className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#201028] sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            Everything you need to know about borrowing and lending.
          </p>
          <div
            aria-hidden="true"
            className="mt-6 h-1 w-20 -skew-x-45 bg-[#781868]"
          />
        </div>

        <Accordion
          multiple={false}
          className="w-full bg-white px-5 py-4 sm:px-8 sm:py-6"
        >
          {questions.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`question-${index + 1}`}
              className="border-[#781868]/10"
            >
              <AccordionTrigger className="items-center gap-4 py-3 text-sm font-medium text-[#201028] hover:no-underline sm:gap-5 sm:py-4 sm:text-base [&_[data-slot=accordion-trigger-icon]]:size-8 [&_[data-slot=accordion-trigger-icon]]:rounded-sm [&_[data-slot=accordion-trigger-icon]]:bg-[#201028] [&_[data-slot=accordion-trigger-icon]]:p-1.5 [&_[data-slot=accordion-trigger-icon]]:text-white">
                {question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 pl-12 text-sm leading-6 text-muted-foreground sm:pl-13">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
