import { boosterTypes, breakdownBundleQuantity, 
  DEFAULT_CART, 
  getLocalRate, getUnitPrice, upsertItemsIntoCart } from "@/utils/guestCartUtils";
import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = 'suncore-cart';
const loadGuestCart = () => {
  if (typeof window === "undefined") {
    return DEFAULT_CART;
  }

  const saved = localStorage.getItem(CART_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_CART;
    }
  }

  return DEFAULT_CART;
};

const saveGuestCart = (cart: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState: loadGuestCart(),
  reducers: {
    addGuestCartItem: (state, action) => {
      const {productType, quantity, asicSpec, currency, currencySymbol, country, prices, isBooster} = action.payload;
      
      if (boosterTypes.includes(productType) || isBooster) {
        const unitPrice = prices.default;
        const newItem = {
          productType,
          quantity,
          unitPrice: unitPrice,
          totalPrice: unitPrice * quantity,
          isBooster: true,
          asicSpec: undefined,
        };
        
        state.items = upsertItemsIntoCart(state.items, [newItem]);
        state.totalAmount = state.items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);
        state.currency = currency;
        state.currencySymbol = currencySymbol;
        state.country = country;
      }

      // fixed types
      const fixedTypes = ['SUNCORE_BUNDLE_TRIO', 'SUNCORE_BUNDLE_PLUS'];
      if (fixedTypes.includes(productType)) {
        const unitPrice = asicSpec ? prices[asicSpec.model] : prices.default;
        const newItem = {
          productType,
          quantity,
          unitPrice: unitPrice,
          totalPrice: unitPrice * quantity,
          isBooster: false,
          asicSpec: asicSpec || undefined,
        };

        state.items = upsertItemsIntoCart(state.items, [newItem]);
        state.totalAmount = state.items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);
        state.currency = currency;
        state.currencySymbol = currencySymbol;
        state.country = country;
      }

      // SUNCORE_BUNDLE complex breakdown
      if (productType === 'SUNCORE_BUNDLE') {
        if (!asicSpec?.model) {
          return state;
        }

        // compute existing bundle qty for this model in cart (in cart currency) -> need normalized by unit sizes
        let existingBundleQty = 0;
        for (const it of state.items) {
          if ((it.asicSpec?.model || '') === (asicSpec.model || '')) {
            if (it.productType === 'SUNCORE_BUNDLE' && !it.isBooster) {
              existingBundleQty += it.quantity;
            }
            if (it.productType === 'SUNCORE_BUNDLE_TRIO') {
              existingBundleQty += it.quantity * 3;
            }
          }
          
        }

        const newTotalBundles = existingBundleQty + quantity;
        
        // breakdown newTotalBundles into lines according to rules, applying user.hasPaid for 25+
        const newBundleLines = breakdownBundleQuantity(newTotalBundles, false, asicSpec.model);
    
        state.items = state.items.filter(
          (it: any) =>
            !(
              (it.productType === 'SUNCORE_BUNDLE' || it.productType === 'SUNCORE_BUNDLE_TRIO') &&
              (it.asicSpec?.model || '') === (asicSpec.model || '')
            )
        );

        const rate = getLocalRate(prices[asicSpec.model], getUnitPrice('SUNCORE_BUNDLE', asicSpec.model));
        const itemsToAdd = newBundleLines?.map((line) => ({
            productType: line.productType,
            quantity: line.quantity,
            unitPrice: Math.round(line.unitPrice * rate),
            totalPrice: Math.round(line.totalPrice * rate),
            isBooster: false,
            asicSpec: asicSpec,
        }));
        
        
        state.items = upsertItemsIntoCart(state.items, itemsToAdd);
        state.totalAmount = state.items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);
        state.currency = currency;
        state.currencySymbol = currencySymbol;
        state.country = country;
      }
      saveGuestCart(state);
    },

    updateGuestCartItem: (state, action) => {
      const {productType, quantity, asicSpec, unitPrice, isBooster} = action.payload;
      if (boosterTypes.includes(productType) || isBooster) {
        const idx = state.items.findIndex((it: any) => it.productType === productType && it.isBooster);
        if (idx === -1) {
          return;
        }
        
        state.items[idx].quantity = quantity;
        state.items[idx].unitPrice = unitPrice;
        state.items[idx].totalPrice = unitPrice * quantity;
        state.totalAmount = state.items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);
      }
      if (productType === 'SUNCORE_BUNDLE_PLUS') {
        if (!asicSpec?.model) {
          return state;
        }
        const idx = state.items.findIndex(
          (it: any) =>
            it.productType === productType &&
            !it.isBooster &&
            (it.asicSpec?.model || '') === (asicSpec.model || '')
        );
        if (idx === -1) {
          throw new Error('Item not found in cart');
        }
        state.items[idx].quantity = quantity;
        state.items[idx].unitPrice = unitPrice;
        state.items[idx].totalPrice = unitPrice * quantity;
        state.totalAmount = state.items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);
      }

      if (productType === 'SUNCORE_BUNDLE' || productType === 'SUNCORE_BUNDLE_TRIO') {
        if (!asicSpec?.model) {
          return state;
        }
    
        // compute existing bundle qty
        let existingBundleQty = 0;
        for (const it of state.items) {
          if ((it.asicSpec?.model || '') === (asicSpec.model || '')) {
            if (it.productType === 'SUNCORE_BUNDLE' && !it.isBooster) {
              existingBundleQty += it.quantity;
            }
            if (it.productType === 'SUNCORE_BUNDLE_TRIO') {
              existingBundleQty += it.quantity * 3;
            }
          }
        }
    
        // compute current contribution
        const curr = state.items.filter(
          (it: any) =>
            it.productType === productType &&
            !it.isBooster &&
            (it.asicSpec?.model || '') === (asicSpec.model || '')
        );
        const currQty = curr.reduce((s: number, it: any) => s + it.quantity, 0);
        const currentContribution = productType === 'SUNCORE_BUNDLE_TRIO' ? currQty * 3 : currQty;
    
        const newTotalBundles =
          existingBundleQty -
          currentContribution +
          (productType === 'SUNCORE_BUNDLE_TRIO' ? quantity * 3 : quantity);
    
        const newBundleLines = breakdownBundleQuantity(
          newTotalBundles,
          false,
          asicSpec.model
        );
    
        state.items = state.items.filter(
          (it: any) =>
            !(
              (it.productType === 'SUNCORE_BUNDLE' || it.productType === 'SUNCORE_BUNDLE_TRIO') &&
              (it.asicSpec?.model || '') === (asicSpec.model || '')
            )
        );
    
        const rate = getLocalRate(unitPrice, getUnitPrice('SUNCORE_BUNDLE', asicSpec.model));
        const itemsToAdd = newBundleLines?.map((line) => ({
          productType: line.productType,
          quantity: line.quantity,
          unitPrice: Math.round(line.unitPrice * rate),
          totalPrice: Math.round(line.totalPrice * rate),
          isBooster: false,
          asicSpec: asicSpec,
        }));
    
        state.items = upsertItemsIntoCart(state.items, itemsToAdd);
        state.totalAmount = state.items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);
      }
      saveGuestCart(state);
    },

    removeGuestCartItem: (state, action) => {
      const {productType, asicSpec} = action.payload;
      
      state.items = state.items.filter(
        (item: any) =>
          item.productType !== productType || (item.asicSpec?.model || '') !== (asicSpec?.model || '')
      );
    
      state.totalAmount = state.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
      saveGuestCart(state);
    },

    clearGuestCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.currency = "USD";
      state.currencySymbol ='$';
      state.country = 'USA';
      saveGuestCart(state);
    },
  },
});

export const {
  addGuestCartItem,
  updateGuestCartItem,
  removeGuestCartItem,
  clearGuestCart,
} = guestCartSlice.actions;

export default guestCartSlice.reducer;