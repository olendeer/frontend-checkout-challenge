// productId → количество. Лежит отдельным файлом без импортов: индекс собирают и корзина,
// и каталог, а тянуть друг друга через бочку им нельзя.
export type QuantityIndex = ReadonlyMap<string, number>;
