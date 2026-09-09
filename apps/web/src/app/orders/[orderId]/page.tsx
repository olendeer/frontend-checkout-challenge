import { Suspense } from 'react';

import { OrderModule } from 'features/order';

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

const OrderPage = async ({ params }: OrderPageProps) => {
  const { orderId } = await params;

  return (
    <Suspense>
      <OrderModule orderId={orderId} />
    </Suspense>
  );
};

export default OrderPage;
