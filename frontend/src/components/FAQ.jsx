import React from "react";
export function FAQ() {
    const faqs = [
        {
            q: "How do I start earning with KWICK?",
            a: "Sign up online, complete quick verification, pick up your EV, and start earning immediately with your preferred delivery partner."
        },
        {
            q: "What are the earning potentials?",
            a: "Dedicated partners can earn up to ₹75,000 per month, depending on hours worked, delivery platform, and savings from zero petrol with unlimited battery swapping."
        },
        {
            q: "How do battery swaps work?",
            a: "Enjoy fast, cost-effective charging with our battery swap system—2–3 free daily swaps at 500+ stations, extra swaps anytime, and back on the road in under 2 minutes."
        },
        {
            q: "Is insurance included?",
            a: "Every KWICK EV rental includes standard insurance, with premium plans offering extended coverage—so you can deliver with complete peace of mind."
        },
        {
            q: "How can I contact support?",
            a: "Get fast, reliable support anytime via phone, email, or live chat in the KWICK partner app."
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
