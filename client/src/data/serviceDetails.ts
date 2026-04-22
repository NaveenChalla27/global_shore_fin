
export type Faq = {q: string; a: string};

export type ServiceDetail = {
    slug: string;
    name: string;
    category: string;
    categorySlug: string;
    benefit: string;
    description: string;
    whoFor: string[];
    includes: string[];
    whyChoose: string[];
    faqs: Faq[];
};

export type ServiceCategory = {
    slug: string;
    name: string;
    blurb?: string;
    services: ServiceDetail[];
};

const WHY_CHOOSE_DEFAULT = [
    "100% remote delivery — work with us from anywhere in the US.",
    "IRS-compliant and CPA-supervised — accuracy you can count on.",
    "Flat-rate pricing — no surprise bills, transparent fee structure.",
];

const FAQ_DEFAULT: Faq[] = [
    {
        q: "How quickly can you get started?",
        a: "Most engagements begin within 3–5 business days of our discovery call once documents are shared.",
    },
    {
        q: "How do we share documents securely?",
        a: "We provide a secure client portal with end-to-end encryption. We never accept sensitive data over email.",
    },
    {
        q: "Do you work with clients outside the US?",
        a: "Yes — we serve NRIs, expats, and US business owners in 30+ countries.",
    },
];

function svc(
    slug: string,
    name: string,
    category: string,
    categorySlug: string,
    benefit: string,
    description: string,
    whoFor: string[],
    includes: string[],
    faqs: Faq[] = FAQ_DEFAULT,
    whyChoose: string[] = WHY_CHOOSE_DEFAULT,
): ServiceDetail {
    return {slug, name, category, categorySlug, benefit, description, whoFor, includes, whyChoose, faqs};
}

const PAYROLL_HR: ServiceCategory = {
    slug: "payroll-hr",
    name: "Payroll & HR",
    blurb: "Run payroll, file payroll taxes, and stay compliant with US labour law — done for you.",
    services: [
        svc(
            "payroll-services",
            "Payroll Services",
            "Payroll & HR",
            "payroll-hr",
            "End-to-end payroll processing for US businesses — accurate, on time, every time.",
            "We calculate employee wages, deduct federal and state taxes, issue pay stubs, manage direct deposits, and file quarterly payroll reports so your team gets paid right and your filings stay clean.",
            [
                "Small businesses and startups",
                "Mid-size companies with W-2 employees",
                "Businesses with multi-state payroll needs",
                "Founders running payroll for the first time",
            ],
            [
                "Weekly, bi-weekly, or monthly payroll runs",
                "W-2 and 1099 generation at year-end",
                "Direct deposit setup",
                "Payroll registers and reports",
                "Year-end reporting and reconciliation",
            ],
        ),
        svc(
            "payroll-taxation",
            "Payroll Taxation Services",
            "Payroll & HR",
            "payroll-hr",
            "Accurate calculation and remittance of every payroll-related tax.",
            "Federal income tax withholding, FICA (Social Security & Medicare), FUTA/SUTA, and state income taxes — calculated, deposited, and filed on schedule so you never see a penalty notice.",
            [
                "Employers with W-2 staff",
                "Multi-state employers",
                "Businesses behind on payroll deposits",
            ],
            [
                "Federal Form 941 and 940 filings",
                "State unemployment insurance (SUTA) filings",
                "Federal and state payroll tax deposits",
                "Penalty avoidance advisory",
                "Year-end reconciliation (W-3 and state equivalents)",
            ],
        ),
        svc(
            "payroll-compliance",
            "Payroll Compliance",
            "Payroll & HR",
            "payroll-hr",
            "Stay aligned with US federal and state labour laws.",
            "We ensure your payroll practices comply with DOL requirements, IRS regulations, and state labour codes — including worker classification, minimum wage, and record retention.",
            [
                "Employers worried about misclassification",
                "Businesses expanding into new states",
                "Companies preparing for a DOL or IRS audit",
            ],
            [
                "Compliance audits and gap analysis",
                "Worker classification reviews (W-2 vs 1099)",
                "Minimum wage and overtime compliance",
                "Record retention guidance",
                "Multi-state labour-law guidance",
            ],
        ),
    ],
};

const ACCOUNTING: ServiceCategory = {
    slug: "accounting-bookkeeping",
    name: "Accounting & Bookkeeping",
    blurb: "Clean books, accurate financials, and the management reporting your business needs.",
    services: [
        svc(
            "bookkeeping-services",
            "Bookkeeping Services",
            "Accounting & Bookkeeping",
            "accounting-bookkeeping",
            "Clean, organised books — every month, on time.",
            "We record every transaction, categorise income and expenses, and produce monthly financial reports so you always know where your business stands.",
            [
                "Small businesses and startups",
                "E-commerce sellers",
                "Service businesses and consultancies",
                "Anyone behind on their books",
            ],
            [
                "Monthly transaction recording",
                "Chart of accounts setup",
                "Income statement and balance sheet",
                "QuickBooks / Xero / Zoho management",
                "Catch-up bookkeeping if you're behind",
            ],
        ),
        svc(
            "accounting-services",
            "Accounting Services",
            "Accounting & Bookkeeping",
            "accounting-bookkeeping",
            "Full-cycle accounting that gives you the numbers leaders need.",
            "Beyond bookkeeping — financial statement preparation, management reporting, budgeting, and CFO-level strategic analysis.",
            [
                "Growing businesses ready for management reporting",
                "Founders preparing for a raise or sale",
                "Companies needing CFO-level insight without the salary",
            ],
            [
                "Monthly, quarterly, and annual financial statements",
                "Cash flow analysis and forecasting",
                "Budget vs actual reporting",
                "Outsourced CFO advisory",
                "GAAP-compliant reporting",
            ],
        ),
        svc(
            "bank-reconciliations",
            "Bank Reconciliations",
            "Accounting & Bookkeeping",
            "accounting-bookkeeping",
            "Catch errors and fraud the moment they happen.",
            "We match your bank statements against your books every month, explain variances, and post the corrections — so your books are always trustworthy.",
            [
                "Businesses doing reconciliation only annually",
                "Owners suspicious of duplicate or fraudulent charges",
                "Companies preparing for an audit or loan",
            ],
            [
                "Monthly reconciliation reports",
                "Variance explanations",
                "Journal entry corrections",
                "Multi-account / multi-currency support",
            ],
        ),
        svc(
            "cash-reconciliations",
            "Cash Reconciliations",
            "Accounting & Bookkeeping",
            "accounting-bookkeeping",
            "Reconcile every cash drawer, petty cash tin, and POS system.",
            "We reconcile cash balances across multiple accounts, petty cash, and point-of-sale systems to ensure every dollar is accounted for.",
            [
                "Retailers and restaurants",
                "Multi-location businesses",
                "Operations with petty cash floats",
            ],
            [
                "Daily / weekly cash reconciliation",
                "POS-to-bank reconciliation",
                "Petty cash audits",
                "Variance reporting",
            ],
        ),
        svc(
            "accounts-receivable",
            "Accounts Receivable",
            "Accounting & Bookkeeping",
            "accounting-bookkeeping",
            "Get paid faster with disciplined AR management.",
            "We invoice your customers, follow up on unpaid balances, and report on AR ageing so cash actually arrives in your account.",
            [
                "Businesses with slow-paying customers",
                "Service firms with high invoice volume",
                "Companies losing track of outstanding balances",
            ],
            [
                "Invoice generation and dispatch",
                "AR ageing reports",
                "Payment follow-up calls and emails",
                "Bad debt tracking",
                "Customer statement runs",
            ],
        ),
        svc(
            "accounts-payable",
            "Accounts Payable",
            "Accounting & Bookkeeping",
            "accounting-bookkeeping",
            "Pay vendors on time, optimise cash flow, and never miss a 1099.",
            "We enter vendor invoices, schedule payments, and run AP ageing reports — keeping your suppliers happy and your cash working harder.",
            [
                "Businesses with 20+ vendor invoices a month",
                "Companies tracking 1099 vendors manually",
                "Owners drowning in paperwork",
            ],
            [
                "Vendor invoice entry",
                "Payment scheduling",
                "AP ageing reports",
                "1099 vendor tracking",
                "Approval workflow setup",
            ],
        ),
    ],
};

const TAXATION: ServiceCategory = {
    slug: "taxation",
    name: "Taxation",
    blurb: "Federal, state, individual, business, and expat tax — prepared, filed, and planned.",
    services: [
        svc(
            "individual-taxation",
            "Individual Taxation",
            "Taxation",
            "taxation",
            "Federal and state tax return preparation for residents, NRIs, and US citizens abroad.",
            "We prepare federal and state returns for US residents, green-card holders, H1B / L1 visa holders, NRIs, and US citizens living overseas — including treaty analysis and amended returns.",
            [
                "W-2 employees and freelancers",
                "H1B, L1, and OPT visa holders",
                "Green-card holders and US citizens abroad",
                "NRIs with US income",
            ],
            [
                "Form 1040 and 1040-NR preparation",
                "All 50 state returns",
                "FBAR and FATCA filings",
                "ITIN applications (Form W-7)",
                "Amended returns (1040-X)",
                "Tax planning and projections",
            ],
        ),
        svc(
            "business-taxation",
            "Business Taxation",
            "Taxation",
            "taxation",
            "Tax preparation and planning for every US entity type.",
            "Whether you're a single-member LLC or a multi-state C-Corp, we prepare your returns, file estimates, and plan ahead so the bill is no surprise.",
            [
                "LLCs (single and multi-member)",
                "S-Corps, C-Corps, and Partnerships",
                "Sole proprietors filing Schedule C",
            ],
            [
                "Form 1120 (C-Corp)",
                "Form 1120-S (S-Corp)",
                "Form 1065 (Partnership) with K-1s",
                "Schedule C (Sole Proprietor)",
                "Quarterly estimated taxes",
                "State business returns and franchise taxes",
            ],
        ),
        svc(
            "expat-taxation",
            "Expat Taxation",
            "Taxation",
            "taxation",
            "Specialised tax help for US citizens abroad and foreign nationals in the US.",
            "We handle Foreign Earned Income Exclusion, Foreign Tax Credit, FBAR, FATCA, treaty analysis, and Streamlined Filing Procedures so you stay compliant wherever you live.",
            [
                "US citizens and green-card holders living abroad",
                "Foreign nationals working in the US",
                "Dual-status filers in their first or last US year",
                "Anyone behind on FBAR / streamlined catch-up",
            ],
            [
                "Form 2555 — Foreign Earned Income Exclusion",
                "Form 1116 — Foreign Tax Credit",
                "FBAR (FinCEN 114)",
                "Form 8938 (FATCA)",
                "Tax treaty analysis",
                "Streamlined Foreign Offshore Procedures",
            ],
        ),
        svc(
            "sales-use-tax",
            "Sales & Use Tax Services",
            "Taxation",
            "taxation",
            "Sales tax registration, filing, and nexus management — all 50 states.",
            "We analyse your nexus footprint, register you in the right states, file your returns on schedule, and represent you in voluntary disclosure agreements when needed.",
            [
                "E-commerce and SaaS businesses",
                "Multi-state sellers",
                "Companies that crossed Wayfair thresholds",
            ],
            [
                "Nexus analysis (physical and economic)",
                "State registration",
                "Monthly, quarterly, and annual filings",
                "Voluntary Disclosure Agreements (VDAs)",
                "Audit defence",
            ],
        ),
    ],
};

const COMPLIANCE: ServiceCategory = {
    slug: "audit-compliance",
    name: "Audit & Compliance",
    blurb: "Audit support, payroll compliance, and multi-state filings to keep you in good standing.",
    services: [
        svc(
            "auditing",
            "Auditing",
            "Audit & Compliance",
            "audit-compliance",
            "Independent review and verification of your financial records.",
            "Internal-audit support, audit-readiness reviews, and small-business financial statement audits to give lenders, investors, and boards confidence in your numbers.",
            [
                "Companies preparing for a bank loan",
                "Startups raising a priced round",
                "Non-profits required to audit annually",
            ],
            [
                "Internal audit support",
                "Preparation for external audits",
                "Audit readiness reviews",
                "Financial statement audits for small businesses",
            ],
        ),
        svc(
            "payroll-compliance-audit",
            "Payroll Compliance",
            "Audit & Compliance",
            "audit-compliance",
            "Audit-grade payroll compliance reviews.",
            "A deep review of your payroll process — classification, deposits, filings, and record retention — so you can fix issues before the IRS or DOL finds them.",
            [
                "Employers worried about a notice",
                "Companies expanding into new states",
                "Acquirers performing payroll due diligence",
            ],
            [
                "Worker classification audit",
                "Federal and state filing review",
                "Deposit timeliness review",
                "Recordkeeping compliance",
                "Remediation roadmap",
            ],
        ),
        svc(
            "other-state-compliance",
            "Other State Compliance",
            "Audit & Compliance",
            "audit-compliance",
            "Stay in good standing in every state you operate in.",
            "Annual reports, foreign qualifications, business-licence renewals, and registered-agent maintenance — handled across multiple states.",
            [
                "Multi-state businesses",
                "Companies that recently expanded",
                "Owners who lost track of state filings",
            ],
            [
                "Annual report filings",
                "Foreign qualification filings",
                "State business licence renewals",
                "Registered agent maintenance",
                "Good-standing certificates",
            ],
        ),
    ],
};

const FORMATION: ServiceCategory = {
    slug: "business-formation",
    name: "Business Formation",
    blurb: "Form a US LLC or corporation — even if you're not in the US.",
    services: [
        svc(
            "llc-formation",
            "LLC Formation",
            "Business Formation",
            "business-formation",
            "Set up a US LLC the right way — for residents and non-residents.",
            "From state selection to EIN, operating agreement, and business banking — we handle every step of forming your US LLC, even if you've never set foot in the country.",
            [
                "Non-resident founders",
                "Freelancers going limited",
                "Real-estate investors",
                "Anyone forming their first US entity",
            ],
            [
                "State selection advisory",
                "Articles of Organisation filing",
                "EIN application (with or without SSN)",
                "Operating agreement drafting",
                "Registered agent service (1st year)",
                "S-Corp election (if appropriate)",
            ],
        ),
        svc(
            "company-incorporation",
            "Company Incorporation",
            "Business Formation",
            "business-formation",
            "Incorporate a C-Corp or S-Corp — Delaware, Wyoming, or your home state.",
            "Full incorporation service for US founders and international entrepreneurs — including bylaws, stock issuance, board minutes, and EIN.",
            [
                "VC-backed startups (typically Delaware C-Corp)",
                "Established businesses electing S-Corp status",
                "Non-residents launching a US company",
            ],
            [
                "Articles of Incorporation filing",
                "Bylaws and corporate kit",
                "EIN and S-Corp election (if needed)",
                "Registered agent service",
                "Banking introduction",
                "BOI / Corporate Transparency Act filing",
            ],
        ),
        svc(
            "multi-state-compliance",
            "Other State Compliance",
            "Business Formation",
            "business-formation",
            "Ongoing compliance filings for businesses operating in multiple US states.",
            "Once you're formed, the work continues. We keep you in good standing across every state where you have nexus — annual reports, foreign qualifications, and licence renewals.",
            [
                "Multi-state operations",
                "Companies with remote employees in several states",
                "Businesses growing into new markets",
            ],
            [
                "Annual reports",
                "Foreign qualification filings",
                "State business licence renewals",
                "Registered agent maintenance",
            ],
        ),
    ],
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [PAYROLL_HR, ACCOUNTING, TAXATION, COMPLIANCE, FORMATION];

const ALL_SERVICES: ServiceDetail[] = SERVICE_CATEGORIES.flatMap((c) => c.services);

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
    return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
    return ALL_SERVICES.find((s) => s.slug === slug);
}
