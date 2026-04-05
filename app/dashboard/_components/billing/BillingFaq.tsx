"use client";

const FAQS = [
      {
            q: "What happens when I hit the free limit?",
            a: "Your prompts will be paused. You can upgrade to Pro for unlimited access at any time.",
      },
      {
            q: "Can I cancel my subscription?",
            a: "Yes, you can cancel anytime. Your Pro access continues until the end of the billing period.",
      },
      {
            q: "Is my payment information secure?",
            a: "All payments are processed securely through Dodo Payments. We never store your card details.",
      },
      {
            q: "What payment methods are accepted?",
            a: "Dodo Payments supports major credit and debit cards, UPI, and other local payment methods.",
      },
];

export default function BillingFaq() {
      return (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-3.5">
                        <h3 className="text-[13px] font-semibold text-slate-800">
                              Frequently Asked Questions
                        </h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                        {FAQS.map((faq) => (
                              <div key={faq.q} className="px-5 py-4">
                                    <p className="mb-1 text-[12.5px] font-semibold text-slate-800">
                                          {faq.q}
                                    </p>
                                    <p className="text-[12px] leading-relaxed text-slate-500">
                                          {faq.a}
                                    </p>
                              </div>
                        ))}
                  </div>
            </div>
      );
}
