export function serializeMoney(value) {
  return value === undefined || value === null ? '0' : value.toString();
}

export function serializeQuote(quote) {
  return {
    ...quote,
    items: quote.items.map((item) => ({ ...item, unitPricePaise: serializeMoney(item.unitPricePaise), lineSubtotalPaise: serializeMoney(item.lineSubtotalPaise) })),
    discounts: quote.discounts.map((item) => ({ ...item, amountPaise: serializeMoney(item.amountPaise) })),
    subtotalPaise: serializeMoney(quote.subtotalPaise),
    discountPaise: serializeMoney(quote.discountPaise),
    convenienceFeePaise: serializeMoney(quote.convenienceFeePaise),
    gstPaise: serializeMoney(quote.gstPaise),
    totalPaise: serializeMoney(quote.totalPaise)
  };
}
