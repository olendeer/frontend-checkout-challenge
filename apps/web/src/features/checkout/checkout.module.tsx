'use client';

import { getErrorMessage } from 'domain/errors';
import { formatMoney } from 'domain/money';
import {
  Alert,
  Card,
  EmptyState,
  Fieldset,
  LinkButton,
  RadioOption,
  Spinner,
  TextField,
} from 'ui-kit';

import { useCheckoutModule } from './checkout.hooks';
import { OrderSummary } from './order-summary';
import styles from './checkout.module.scss';

const SUBMIT_LABEL = {
  card: 'Оформить и перейти к оплате',
  cash_on_delivery: 'Оформить заказ',
};

export const CheckoutModule = () => {
  const {
    cart,
    deliveryMethod,
    form,
    isSubmitting,
    options,
    pickupPoints,
    quote,
    submit,
    submitError,
  } = useCheckoutModule();

  const { errors } = form.formState;

  if (cart.isPending || options.isPending) {
    return (
      <Card className={styles.state}>
        <Spinner label="Загружаем оформление" /> Загружаем оформление…
      </Card>
    );
  }

  if (!cart.data || cart.data.isEmpty) {
    return (
      <EmptyState
        action={<LinkButton href="/">Перейти в каталог</LinkButton>}
        description="Оформить заказ можно только с товарами в корзине."
        title="Корзина пуста"
      />
    );
  }

  return (
    <form className={styles.layout} noValidate onSubmit={submit}>
      <h1 className={styles.heading}>Оформление заказа</h1>

      <div className={styles.columns}>
        <div className={styles.sections}>
          {submitError ? (
            <Alert title="Заказ не создан">{getErrorMessage(submitError)}</Alert>
          ) : null}

          <Card>
            <fieldset className={styles.group}>
              <legend className={styles.legend}>Получатель</legend>
              <TextField
                autoComplete="name"
                error={errors.customer?.name?.message}
                label="Имя и фамилия"
                {...form.register('customer.name')}
              />
              <TextField
                autoComplete="email"
                error={errors.customer?.email?.message}
                inputMode="email"
                label="Электронная почта"
                {...form.register('customer.email')}
              />
              <TextField
                autoComplete="tel"
                error={errors.customer?.phone?.message}
                hint="Например, +79990000000"
                inputMode="tel"
                label="Телефон"
                {...form.register('customer.phone')}
              />
            </fieldset>
          </Card>

          <Card>
            <div className={styles.group}>
              <Fieldset legend="Способ доставки">
                {options.data?.deliveryMethods.map((method) => (
                  <RadioOption
                    description={
                      method.freeFrom
                        ? `${formatMoney(method.price)}, бесплатно от ${formatMoney(method.freeFrom)}`
                        : formatMoney(method.price)
                    }
                    key={method.id}
                    label={method.title}
                    value={method.id}
                    {...form.register('delivery.method')}
                  />
                ))}
              </Fieldset>

              {deliveryMethod === 'pickup' ? (
                <Fieldset error={errors.delivery?.pickupPointId?.message} legend="Пункт выдачи">
                  {pickupPoints.map((point) => (
                    <RadioOption
                      description={point.address}
                      key={point.id}
                      label={point.title}
                      value={point.id}
                      {...form.register('delivery.pickupPointId')}
                    />
                  ))}
                </Fieldset>
              ) : (
                <div className={styles.address}>
                  <TextField
                    autoComplete="address-level2"
                    error={errors.delivery?.address?.city?.message}
                    label="Город"
                    {...form.register('delivery.address.city')}
                  />
                  <TextField
                    autoComplete="address-line1"
                    error={errors.delivery?.address?.street?.message}
                    label="Улица"
                    {...form.register('delivery.address.street')}
                  />
                  <TextField
                    error={errors.delivery?.address?.house?.message}
                    label="Дом"
                    {...form.register('delivery.address.house')}
                  />
                  <TextField
                    error={errors.delivery?.address?.apartment?.message}
                    label="Квартира (необязательно)"
                    {...form.register('delivery.address.apartment')}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card>
            <Fieldset legend="Способ оплаты">
              {options.data?.paymentMethods.map((method) => (
                <RadioOption
                  key={method.id}
                  label={method.title}
                  value={method.id}
                  {...form.register('paymentMethod')}
                />
              ))}
            </Fieldset>
          </Card>
        </div>

        <OrderSummary
          isSubmitting={isSubmitting}
          quote={quote}
          submitLabel={SUBMIT_LABEL[form.watch('paymentMethod')]}
        />
      </div>
    </form>
  );
};
