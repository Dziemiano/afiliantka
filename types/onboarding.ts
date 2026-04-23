export type OnboardingStatus =
  | "reading_pdf"
  | "selecting_offers"
  | "completing_requirements"
  | "accounts_verified"
  | "pending_approval"
  | "approved";

export interface UserOnboarding {
  id: string;
  user_id: string;
  status: OnboardingStatus;
  pdf_acknowledged_at: string | null;
  offers_selected_at: string | null;
  accounts_opened_at: string | null;
  requirements_completed_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
}

export interface UserOfferSelection {
  id: string;
  user_id: string;
  offer_sanity_id: string;
  offer_slug: string;
  offer_name: string;
  requirement_text: string | null;
  account_opened: boolean;
  account_opened_at: string | null;
  requirement_completed: boolean;
  completed_at: string | null;
  rejection_reason: string | null;
  rejected_at: string | null;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  related_user_id: string | null;
  read: boolean;
  created_at: string;
}
