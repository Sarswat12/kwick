import React from "react";
export function FAQ() {
    const faqs = [
        {
            q: "How do I start earning with KWICK?",
            a: "Sign up, complete KYC, pick a plan and start renting a KWICK EV. Pair with delivery platforms to begin earning immediately."
        },
        {
            q: "What are the earning potentials?",
            a: "Riders typically earn between ₹15,000 - ₹50,000 per month depending on hours and services used."
        },
        {
            q: "How do battery swaps work?",
            a: "Swap stations are available across the city—simply drive to a station and exchange your depleted battery for a charged one in under 2 minutes."
        },
        {
            q: "Is insurance included?",
            a: "Yes. All rental plans include basic insurance; premium plans offer extended coverage."
        },
        {
            q: "How can I contact support?",
            a: "Use the Support page in the app or email our helpdesk; response times are typically under 24 hours."
        }
    ];
    return (<section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-black mb-6 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((f, i) => (<details key={i} className="border rounded-lg p-4" data-faq-index={i}>
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <div className="mt-2 text-gray-700">{f.a}</div>
            </details>))}
        </div>
      </div>
    </section>);
}
