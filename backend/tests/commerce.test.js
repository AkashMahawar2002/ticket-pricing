import { describe, expect, it } from 'vitest';
import { calculatePrice } from '../src/domain/pricing/pricing-engine.js';
import { normalizePriceList, parseMoneyToPaise, parsePriceList } from '../src/domain/imports/price-list.js';

describe('pricing engine', () => {
  it('calculates exact paise totals with capped membership discount, fee, and GST', () => {
    const result = calculatePrice({
      items: [{ tierCode: 'GOLD', tierName: 'Gold', quantity: 2, unitPricePaise: 22000n }],
      policy: { festivalDiscount: { type: 'FLAT_BOOKING', amountPaise: 5000n }, membershipDiscountBasisPoints: 1000, membershipDiscountCapPaise: 15000n, convenienceFeePaise: 300n, gstBasisPoints: 1800, taxableComponents: { ticketSubtotal: true, convenienceFee: true }, roundingMode: 'HALF_UP' },
      membershipStatus: 'ACTIVE'
    });
    expect(result.subtotalPaise).toBe(44000n);
    expect(result.discountPaise).toBe(8900n);
    expect(result.convenienceFeePaise).toBe(600n);
    expect(result.gstPaise).toBe(6426n);
    expect(result.totalPaise).toBe(42126n);
  });
});

describe('messy price-list import', () => {
  it('normalizes casing, formats prices, and classifies every row', () => {
    const records = parsePriceList('seatClass,price\nSilver,150\nSILVER,150.00\nGold,₹220\nRecliner,\nGold,-300');
    const result = normalizePriceList(records, [{ _id: 'silver-id', code: 'SILVER', name: 'Silver' }, { _id: 'gold-id', code: 'GOLD', name: 'Gold' }, { _id: 'recliner-id', code: 'RECLINER', name: 'Recliner' }]);
    expect(result.results.map((item) => item.classification)).toEqual(['ACCEPTED', 'DUPLICATE', 'ACCEPTED', 'REJECTED', 'REJECTED']);
    expect(result.results[0].normalizedPricePaise).toBe(15000n);
    expect(result.results[3].reason).toBe('PRICE_BLANK');
  });

  it('rejects negative and malformed prices without coercion', () => {
    expect(parseMoneyToPaise('-300').error).toBe('PRICE_NEGATIVE');
    expect(parseMoneyToPaise('12.345').error).toBe('PRICE_INVALID');
    expect(parseMoneyToPaise('not-money').error).toBe('PRICE_INVALID');
  });
});
