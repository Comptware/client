import { useAddToCartMutation } from "@/store/features/cart/cartApi";
import { clearGuestCart } from "@/store/features/guestCartSlice";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const CartInitializer = ({ children }: {children: any}) => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const guestCart = useAppSelector((s) => s.guestCart);
  const [addToCart] = useAddToCartMutation();

  useEffect(() => {
    if (!user) return;

    const syncGuestCart = async () => {
      try {
        if (guestCart.items.length > 0) {
          for (const item of guestCart.items) {
            // Wait for the API call to complete
            await addToCart({
              productType: item.productType,
              quantity: item.quantity,
              country: guestCart.country,
              currency: guestCart.currency,
              asicSpec: item.asicSpec
                ? {
                    model: item.asicSpec.model,
                    hashRate: item.asicSpec.hashRate,
                    power: item.asicSpec.power,
                    efficiency: item.asicSpec.efficiency,
                  }
                : undefined,
            }).unwrap();
          }
          //clear Guest Cart after sync
          dispatch(clearGuestCart());
        }
      } catch (error) {
        console.error("Failed to sync guest cart:", error);
      }
    };

    syncGuestCart();
  }, [user, dispatch]);

  return children;
}

export default CartInitializer;