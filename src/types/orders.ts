export type StageTimeline = {
  stage: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "pending" | "in-progress" | "completed";
  started_at: string;
  completed_at?: string;
  notes?: string;
};

export type OrderNotification = {
  type: string;
  sent_at: string;
  channel: string;
};

export type AsicSpec = {
  model: string;
  hashRate: string;
  power: string;
  efficiency: string;
};

export type OrderProduct = {
  productType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isBooster: boolean;
  asicSpec?: AsicSpec;
};

export type OrderDetails = {
  total_amount: number;
  currency: string;
  asic_models: { model: string; quantity: number; unit_price: number }[];
  products: OrderProduct[];
  boosters: {
    productType: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isBooster: boolean;
  }[];
};

export type OrderDocuments = {
  invoice_available?: boolean;
  receipt_available?: boolean;
  management_agreement_pdf?: string;
};

export type OrderPayment = {
  status?: "REMAINING_BALANCE_DUE" | "PAID_IN_FULL" | string;
  status_label?: string;
  amount_paid?: number;
  balance_remaining?: number;
  total_amount?: number;
  currency?: string;
  last_payment_at?: string;
  pay_now_available?: boolean;
  pay_now_url?: string;
  pay_now_action?: {
    cta: string;
    redirect_to: string;
  } | null;
};

export type Order = {
  order_id: string;
  order_status?: "BALANCE_DUE" | "IN_PROGRESS" | "ACTIVATED";
  order_status_label?: string;
  customer_name?: string;
  payment_status?: "REMAINING_BALANCE_DUE" | "PAID_IN_FULL";
  payment_status_label?: string;
  payment_summary?: {
    total_amount?: number;
    amount_paid?: number;
    balance_remaining?: number;
    currency?: string;
    status?: "REMAINING_BALANCE_DUE" | "PAID_IN_FULL";
    status_label?: string;
    pay_now_available?: boolean;
    pay_now_url?: string;
    pay_now_action?: {
      cta: string;
      redirect_to: string;
    } | null;
  };
  go_live_tracking?: {
    stage: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    started_at?: string;
    completed_at?: string;
    notes?: string;
  }[];
  fulfillment_stage: string;
  stage_progress_percentage: number;
  provisioning_complete: boolean;
  provisioning_completed_at?: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED" | "PAUSED" | "DEGRADED" | "active" | "paused" | "degraded";
  createdAt: string;
  updatedAt: string;
  stages_timeline: StageTimeline[];
  order_details: OrderDetails;
  notifications_sent: OrderNotification[];
  userId?: string;
  payment?: OrderPayment;
  documents?: OrderDocuments;
};

export type OrdersListResponse = {
  message: string;
  count: number;
  orders: Order[];
};

export type OrderDetailResponse = {
  message: string;
  order: Order;
};
