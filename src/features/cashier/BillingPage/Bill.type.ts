export interface Bill {
  _id: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    total?: number;
  }[];
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  createdBy?: string;
}
