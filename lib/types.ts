export type Email = {
    id: string;
    sender: string;
    subject: string;
    body: string | null;
    summary: string;
    receivedAt: Date;
    category: string;
  };