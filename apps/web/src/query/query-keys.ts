export const queryKeys = {
  cart: () => ['cart'] as const,
  checkoutOptions: () => ['checkout', 'options'] as const,
  order: (orderId: string) => ['orders', orderId] as const,
  orderPayment: (orderId: string) => ['orders', orderId, 'payment'] as const,
  products: () => ['products'] as const,
  quote: (cartVersion: number, delivery: unknown) => ['quote', cartVersion, delivery] as const,
  quotes: () => ['quote'] as const,
  sandbox: () => ['sandbox'] as const,
  session: () => ['session'] as const,
};
