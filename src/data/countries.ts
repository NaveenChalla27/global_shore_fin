

export type ServiceKey = "payroll" | "tax" | "accounting" | "compliance" | "formation" | "advisory";

export type Service = {
    key: ServiceKey;
    title: string;
    desc?: string;
};

export type Stat = {
    num: string;
    label: string;
};

export type Country = {
    code: string;
    name: string;
    short?: string;
    flag?: string;
    status: "active" | "coming-soon";
    eyebrow: string;
    heroTitle: string;
    heroSub: string;
    trustBadges: string[];
    services: Service[];
    stats: Stat[];
};