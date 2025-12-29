import { DEFAULT_CART } from "./guestCartUtils";

export function formatCart(userCart: any, products: any[]) {
  const safeCart = userCart || DEFAULT_CART;

  return {
    ...safeCart,
    items: (safeCart.items || []).map((item: any) => {
      const product = products.find((p) => p.value === item.productType);

      return {
        ...item,
        description: product?.description || "",
        label: product?.label || "",
      };
    }),
  };
}