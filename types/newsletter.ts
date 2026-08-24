export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  subscribed_at: string;
}
