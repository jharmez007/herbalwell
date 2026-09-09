import { business } from './business';
export const faqs = [
  { question: 'Who is the product intended for?', answer: `${business.product.name} is intended for adult men aged 18 and above. Review the verified label and consult an appropriate healthcare professional to discuss whether it is suitable for you.` },
  { question: 'How do I place an order?', answer: 'Choose your quantity and select “Order via WhatsApp”. Our team will confirm product availability, the total price, payment method and delivery details before you pay.' },
  { question: 'Is ordering confidential?', answer: 'You can enquire directly through a one-to-one WhatsApp conversation. Please avoid sharing sensitive health information. Ask our team to confirm packaging and delivery arrangements; WhatsApp processes messages under its own privacy terms.' },
  { question: 'Where do you deliver?', answer: 'Delivery areas, fees and estimated timelines are awaiting confirmation. Send your general delivery location on WhatsApp so our team can confirm service availability before you pay.' },
  { question: 'How should I use the product?', answer: 'Verified directions have not yet been supplied for this website. Request the current product label before purchasing and follow its verified directions. Do not guess a dose.' },
  { question: 'Can I use it with medication?', answer: 'If you take medication or manage a health condition, consult an appropriate healthcare professional before use. Herbal products may not be suitable for everyone; “natural” does not mean risk-free.' },
  { question: 'What is the returns policy?', answer: 'The detailed returns and refund policy is awaiting business confirmation. Request the applicable terms before payment. If an item arrives damaged or incorrect, contact the team with your order details.' },
];
export const policies = {
  'shipping-returns': { title: 'Delivery, returns & refunds', intro: 'Know what to expect before you place your order.', sections: [
    ['Delivery availability', 'Pending business confirmation: delivery locations, fees, dispatch times and estimated arrival dates. Share your general location with our team to check whether delivery is available. Nationwide delivery is not currently confirmed.'],
    ['Before payment', 'Ask for a written order summary including quantity, current price, delivery fee, total payable, payment method and expected delivery timeline. Discreet packaging arrangements must also be confirmed with the team.'],
    ['Returns and refunds', 'Pending business confirmation: eligibility, return window, product condition requirements, return costs, cancellation rules and refund processing time. Request these terms before paying. This draft does not exclude any applicable consumer rights.'],
    ['Problems with an order', 'For a damaged, incorrect or missing item, contact us on WhatsApp with your order reference and a description of the issue. Do not send payment-card details or sensitive medical information.'],
  ] },
  privacy: { title: 'Your privacy matters', intro: 'A clear explanation of the information this website uses.', sections: [
    ['About this notice', 'Draft for owner review. The legal business name and privacy contact email are awaiting confirmation. Use our WhatsApp contact for privacy enquiries in the meantime. Hosting-provider details and retention practices must be confirmed before launch.'],
    ['Information you choose to share', 'The contact form prepares a WhatsApp message on your device. It does not submit your details to a website database. You choose whether to send the message in WhatsApp. Share only the details needed for your enquiry; avoid including health information.'],
    ['Local storage and analytics', 'This website stores only your adult-age confirmation as a simple local boolean. You can clear it through your browser’s site-data settings. No analytics or advertising trackers are configured. Hosting services may process technical request logs; the owner must confirm their retention period.'],
    ['WhatsApp and external services', 'When you follow a WhatsApp link, your message and use of that service are subject to WhatsApp’s privacy terms. Once sent, the business receives the information you provide. Third-party processing locations, retention periods and any international-transfer safeguards require owner review.'],
    ['Your choices', 'You may contact the business to request information about personal data held in order conversations, request correction or deletion, or raise a privacy concern. Applicable rights, response procedures, legal bases and retention schedules must be completed with appropriate review before launch.'],
  ] },
  terms: { title: 'Terms & conditions', intro: 'Please read these terms before placing an order.', sections: [
    ['Draft status', 'These terms are a draft awaiting business and legal review. Legal business name, jurisdiction, contact email and final sale terms must be confirmed before launch.'],
    ['Adults only', 'Products are intended for adults aged 18 and above. The age notice is a basic access confirmation and does not replace any required age-verification or regulatory process.'],
    ['Product information', 'This website provides general product information, not medical advice. Provisional price, package and stock details are clearly labelled. Request a verified label, ingredients, directions and warnings before deciding to purchase.'],
    ['Orders and payment', 'A WhatsApp message is an enquiry, not a completed checkout or accepted order. Confirm availability, price, delivery, payment and returns terms with customer support before paying. We do not collect card information on this website.'],
    ['Responsible use', 'Use only according to the verified label and advice from an appropriate healthcare professional. No outcome is guaranteed. These draft terms do not restrict any rights that cannot lawfully be excluded.'],
  ] },
  disclaimer: { title: 'Health & product disclaimer', intro: 'Make informed choices about your wellness.', sections: [
    ['General information only', 'For adults 18+. This product is not intended to diagnose, treat, cure or prevent any disease. Website content does not replace personalised advice from an appropriate healthcare professional.'],
    ['Suitability and medication', 'If you take medication or manage a health condition, consult an appropriate healthcare professional before use. Herbal products may have interactions or cause unwanted effects. Individual experiences can vary.'],
    ['Read the verified label', 'Ingredients, directions, contraindications, warnings and storage instructions have not yet been supplied for publication. Request the verified current product label before purchase. Do not use a product if its ingredients, suitability or directions are unclear.'],
    ['If you feel unwell', 'Stop using the product and seek appropriate medical advice if you experience an unwanted reaction. For an emergency, seek urgent local medical assistance.'],
    ['Evidence and registration', 'No clinical validation, government approval, certification or registration is claimed on this website. Publish registration details only after they have been supplied and verified.'],
  ] },
} as const;
export type PolicySlug = keyof typeof policies;
