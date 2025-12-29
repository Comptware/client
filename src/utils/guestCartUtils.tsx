export const DEFAULT_CART = { items: [], totalAmount: 0, currency: "USD", currencySymbol: '$', country: 'USA' };

export const MODEL_PRICING = {
  SUNCORE_BUNDLE: {
    default: 72500,
    'Bitmain Antminer S23 Hyd 3U': 72501, // example future override for asic model
    'Bitmain Antminer S21E XP Hyd 3U': 72500,
  },
  SUNCORE_BUNDLE_PLUS: {
    default: 99500,
    'Bitmain Antminer S23 Hyd 3U': 99501,
    'Bitmain Antminer S21E XP Hyd 3U': 99500,
  },
  SUNCORE_BUNDLE_TRIO: {
    default: 205000,
    'Bitmain Antminer S23 Hyd 3U': 205001,
    'Bitmain Antminer S21E XP Hyd 3U': 205000,
  },
  SUNCORE_POWER_PACK_125: { default: 34500 },
  SUNCORE_POWER_PACK_250: { default: 64500 },
  SUNCORE_POWER_PACK_500: { default: 124500 },
};

export const MODEL_TIER_PRICING = {
  'Bitmain Antminer S21E XP Hyd 3U': [
    { minQty: 25, price: 59_500 },
    { minQty: 10, price: 62_500 },
    { minQty: 5, price: 67_500 },
  ],
  'Bitmain Antminer S23 Hyd 3U': [
    { minQty: 25, price: 59_501 }, // example numbers for S23
    { minQty: 10, price: 62_501 },
    { minQty: 5, price: 67_501 },
  ],
  default: [
    { minQty: 25, price: 59_500 },
    { minQty: 10, price: 62_500 },
    { minQty: 5, price: 67_500 },
  ],
};

export const boosterTypes = [
  'SUNCORE_POWER_PACK_125',
  'SUNCORE_POWER_PACK_250',
  'SUNCORE_POWER_PACK_500',
];

type ProductType = keyof typeof MODEL_PRICING;

export const getUnitPrice = (productType: ProductType, asicModel?: string) => {
  const table = MODEL_PRICING[productType];
  if (!table) {
    return 0;
  } // or throw if you prefer

  // Normalize and safely match against keys in the table
  const foundKey = asicModel
    ? Object.keys(table).find((k) => k.trim().toLowerCase() === asicModel.trim().toLowerCase())
    : null;

  return foundKey ? table[foundKey as keyof typeof table] : table.default;
}

export const sortCartItems = (items: any) => {
  const orderMap: Record<string, number> = {
    SUNCORE_BUNDLE: 1,
    SUNCORE_BUNDLE_PLUS: 2,
    SUNCORE_BUNDLE_TRIO: 3,
    SUNCORE_POWER_PACK_125: 4,
    SUNCORE_POWER_PACK_250: 5,
    SUNCORE_POWER_PACK_500: 6,
  };

  return items.sort((a: any, b: any) => {
    // 1 Primary: productType order
    const aOrder = orderMap[a.productType] || 99;
    const bOrder = orderMap[b.productType] || 99;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // 2 Secondary: ASIC model (alphabetically)
    const aModel = (a.asicSpec?.model || '').toLowerCase();
    const bModel = (b.asicSpec?.model || '').toLowerCase();
    if (aModel !== bModel) {
      return aModel.localeCompare(bModel);
    }

    // 3 Tertiary: booster flag (booster items go last)
    if (a.isBooster !== b.isBooster) {
      return a.isBooster ? 1 : -1;
    }

    // 4️ Fallback: insertion order (no change)
    return 0;
  });
};

export const getLocalRate = (localPrice: number, unitPriceUSD: number) => {
  const rate = localPrice / unitPriceUSD;
  return rate;
}

export const bundleTierUnitPrice = (quantity: number, asicModel: string) => {
  const base = getUnitPrice('SUNCORE_BUNDLE', asicModel);
  const tiers = MODEL_TIER_PRICING[asicModel as keyof typeof MODEL_TIER_PRICING] || MODEL_TIER_PRICING.default;

  // Find the first tier whose minQty the order qualifies for
  const match = tiers.find((t: any) => quantity >= t.minQty);

  // If we matched a tier, the price is the lower of the base and that tier price.
  // (Protects you if base < tier because of temporary promos.)
  const tierPrice = match ? match.price : base;

  return Math.min(base, tierPrice);
};

export const breakdownBundleQuantity = (quantity: number, userHasPaid: boolean, asicModel: string) => {
  if (quantity < 1) {
    return [];
  }

  if (quantity >= 25 && !userHasPaid) {
    console.log('Purchases of 25+ units require contacting sales for new clients');
    return;
  }

  // 5–9, 10–24, 25+ tiers
  if (quantity >= 5) {
    const unit = bundleTierUnitPrice(quantity, asicModel);
    return [
      {
        productType: 'SUNCORE_BUNDLE',
        quantity,
        unitPrice: unit,
        totalPrice: unit * quantity,
      },
    ];
  }

  // 1–4 logic (TRIO etc.)—now uses getUnitPrice
  if (quantity === 3) {
    const trioPrice = getUnitPrice('SUNCORE_BUNDLE_TRIO', asicModel);
    return [
      {
        productType: 'SUNCORE_BUNDLE_TRIO',
        quantity: 1,
        unitPrice: trioPrice,
        totalPrice: trioPrice,
      },
    ];
  }

  if (quantity === 4) {
    const trioPrice = getUnitPrice('SUNCORE_BUNDLE_TRIO', asicModel);
    const singlePrice = getUnitPrice('SUNCORE_BUNDLE', asicModel);
    return [
      {
        productType: 'SUNCORE_BUNDLE_TRIO',
        quantity: 1,
        unitPrice: trioPrice,
        totalPrice: trioPrice,
      },
      {
        productType: 'SUNCORE_BUNDLE',
        quantity: 1,
        unitPrice: singlePrice,
        totalPrice: singlePrice,
      },
    ];
  }

  const singlePrice = getUnitPrice('SUNCORE_BUNDLE', asicModel);
  return [
    {
      productType: 'SUNCORE_BUNDLE',
      quantity,
      unitPrice: singlePrice,
      totalPrice: singlePrice * quantity,
    },
  ];
};

export const upsertItemsIntoCart = (updatedItems: any, itemsToAdd: any) => {
  for (const newItem of itemsToAdd) {
    const existingIndex = updatedItems.findIndex(
      (it: any) =>
        it.productType === newItem.productType &&
        !!it.isBooster === !!newItem.isBooster &&
        (newItem.isBooster
          ? true
          : (it.asicSpec?.model || '') === (newItem.asicSpec?.model || ''))
    );
    
    if (existingIndex >= 0) {
      const existing = updatedItems[existingIndex];
      const newQty = existing.quantity + newItem.quantity;

      updatedItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        unitPrice: newItem.unitPrice,
        totalPrice: newQty * newItem.unitPrice,
      };
    } else {
      updatedItems.push({
        productType: newItem.productType,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        totalPrice: newItem.totalPrice,
        isBooster: !!newItem.isBooster,
        asicSpec: newItem.asicSpec || undefined,
      });
    }
  }
  
  const sortedItems = sortCartItems(updatedItems);
  return sortedItems;
}
