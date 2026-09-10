'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { applyFieldErrors } from 'core/form';
import { getIsCartEmpty } from 'domain/cart';
import {
  CheckoutFormValues,
  DeliveryFormValues,
  getPickupPoints,
  toDelivery,
} from 'domain/checkout';
import { Delivery, PickupPoint } from 'domain/contracts';
import { ApiErrorCodes, getIsErrorCode } from 'domain/errors';
import { useDebouncedValue } from 'hooks';
import {
  queryKeys,
  useCartQuery,
  useCheckoutOptionsQuery,
  useCreateOrderMutation,
  useQuoteQuery,
} from 'query';

import { checkoutSchema, DEFAULT_CHECKOUT_VALUES, deliveryFormSchema } from './checkout.schema';

const DELIVERY_DEBOUNCE_MS = 400;

const toValidDelivery = (values: DeliveryFormValues): Delivery | null =>
  deliveryFormSchema.isValidSync(values) ? toDelivery(values) : null;

export const useCheckoutModule = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const cart = useCartQuery();
  const options = useCheckoutOptionsQuery();
  const createOrder = useCreateOrderMutation();

  const form = useForm<CheckoutFormValues>({
    defaultValues: DEFAULT_CHECKOUT_VALUES,
    mode: 'onTouched',
    resolver: yupResolver(checkoutSchema),
  });

  const deliveryValues = useWatch({ control: form.control, name: 'delivery' });
  const deliveryKey = useDebouncedValue(JSON.stringify(deliveryValues), DELIVERY_DEBOUNCE_MS);

  const delivery = useMemo<Delivery | null>(
    () => toValidDelivery(JSON.parse(deliveryKey) as DeliveryFormValues),
    [deliveryKey],
  );

  const quote = useQuoteQuery(delivery, cart.data?.version, !getIsCartEmpty(cart.data));
  const pickupPoints = useMemo<PickupPoint[]>(() => getPickupPoints(options.data), [options.data]);

  useEffect(() => {
    if (pickupPoints.length > 0 && !form.getValues('delivery.pickupPointId')) {
      form.setValue('delivery.pickupPointId', pickupPoints[0].id);
    }
  }, [form, pickupPoints]);

  const submit = form.handleSubmit(async (values) => {
    if (!quote.data) {
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        customer: values.customer,
        paymentMethod: values.paymentMethod,
        quoteId: quote.data.id,
      });

      const query = values.paymentMethod === 'card' ? '?pay=1' : '';

      router.push(`/orders/${order.id}${query}`);
    } catch (error) {
      applyFieldErrors(error, form.setError);

      if (getIsErrorCode(error, ApiErrorCodes.QUOTE_EXPIRED, ApiErrorCodes.CART_VERSION_CONFLICT)) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.quotes() });
        await cart.refetch();
      }
    }
  });

  return {
    cart,
    deliveryMethod: deliveryValues.method,
    form,
    options,
    pickupPoints,
    quote,
    submit,
    submitError: createOrder.error,
    isSubmitting: createOrder.isPending,
  };
};
