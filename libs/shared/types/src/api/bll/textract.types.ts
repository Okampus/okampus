export type LineItem = { name: string; quantity: number; price: number };
export type ProcessedReceipt = {
  lineItems: LineItem[];
  address: string;
  amount: number | null;
  tax: number | null;
  vendorName: string | null;
  date: string | null;
  phone: string | null;
} | null;
