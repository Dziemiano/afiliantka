export interface CooperationBenefit {
  title: string;
  description: string;
  icon?: string;
}

export interface CooperationProcessStep {
  title: string;
  description: string;
  order?: number;
}

export interface CooperationFaqItem {
  question: string;
  answer: string;
}

export interface CooperationPage {
  heroTitle?: string;
  heroSubtitle?: string;
  benefits?: CooperationBenefit[];
  processSteps?: CooperationProcessStep[];
  faq?: CooperationFaqItem[];
  inviteEmail?: string;
}
