import { AppError } from '../../shared/errors/app-error.js';

function roundRatio(numerator, denominator, mode = 'HALF_UP') {
  if (denominator <= 0n) throw new Error('Invalid rounding denominator');
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  if (remainder === 0n || mode === 'DOWN') return quotient;
  if (mode === 'UP') return quotient + 1n;
  return remainder * 2n >= denominator ? quotient + 1n : quotient;
}

export function calculatePrice({ items, policy, membershipStatus = 'NONE' }) {
  if (!items.length) throw new AppError('At least one ticket is required.', 400, 'EMPTY_TICKET_SELECTION');
  const subtotalPaise = items.reduce((sum, item) => sum + BigInt(item.quantity) * BigInt(item.unitPricePaise), 0n);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  let remaining = subtotalPaise;
  const discounts = [];

  if (policy.festivalDiscount.type === 'FLAT_BOOKING') {
    const amount = BigInt(policy.festivalDiscount.amountPaise || 0);
    const applied = amount > remaining ? remaining : amount;
    if (applied > 0n) discounts.push({ type: 'FESTIVAL_DISCOUNT', description: 'Festival discount', amountPaise: applied });
    remaining -= applied;
  }

  if (membershipStatus === 'ACTIVE' && policy.membershipDiscountBasisPoints > 0) {
    const raw = roundRatio(remaining * BigInt(policy.membershipDiscountBasisPoints), 10000n, policy.roundingMode);
    const cap = BigInt(policy.membershipDiscountCapPaise || 0);
    const applied = raw > cap ? cap : raw;
    if (applied > 0n) discounts.push({ type: 'MEMBERSHIP_DISCOUNT', description: 'Membership discount', amountPaise: applied });
    remaining -= applied;
  }

  const convenienceFeePaise = BigInt(policy.convenienceFeePaise || 0) * BigInt(quantity);
  const taxable = (policy.taxableComponents.ticketSubtotal ? remaining : 0n) + (policy.taxableComponents.convenienceFee ? convenienceFeePaise : 0n);
  const gstPaise = roundRatio(taxable * BigInt(policy.gstBasisPoints || 0), 10000n, policy.roundingMode);
  const discountPaise = discounts.reduce((sum, discount) => sum + discount.amountPaise, 0n);
  return {
    items: items.map((item) => ({ ...item, lineSubtotalPaise: BigInt(item.quantity) * BigInt(item.unitPricePaise) })),
    subtotalPaise,
    discounts,
    discountPaise,
    convenienceFeePaise,
    gstPaise,
    totalPaise: remaining + convenienceFeePaise + gstPaise
  };
}
