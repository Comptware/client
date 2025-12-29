import { OrderDetailClient } from "./OrderDetailClient";

type PageProps = {
  params: {
    orderId: string;
  };
};

export default function OrderDetailPage({ params }: PageProps) {
  return <OrderDetailClient orderId={params.orderId} />;
}
