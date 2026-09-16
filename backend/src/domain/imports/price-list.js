import { AppError } from '../../shared/errors/app-error.js';

export function parsePriceList(csvText) {
  if (typeof csvText !== 'string' || csvText.length > 1_000_000) throw new AppError('CSV input is invalid or too large.', 400, 'INVALID_IMPORT');
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (!lines.length) throw new AppError('CSV input is empty.', 400, 'INVALID_IMPORT');
  const header = lines[0].split(',').map((value) => value.trim().toLowerCase());
  const classIndex = header.indexOf('seatclass');
  const priceIndex = header.indexOf('price');
  if (classIndex < 0 || priceIndex < 0) throw new AppError('CSV must contain seatClass and price columns.', 400, 'INVALID_IMPORT');
  return lines.slice(1).map((line, index) => {
    const columns = line.split(',');
    return { row: index + 2, rawClass: (columns[classIndex] || '').trim(), rawPrice: (columns[priceIndex] || '').trim() };
  });
}

export function parseMoneyToPaise(value) {
  if (value === undefined || value === null || String(value).trim() === '') return { error: 'PRICE_BLANK' };
  const raw = String(value).trim().replace(/^(₹|Rs\.?|INR)\s*/i, '').replace(/,/g, '');
  if (/^-/.test(raw)) return { error: 'PRICE_NEGATIVE' };
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) return { error: 'PRICE_INVALID' };
  const [whole, fraction = ''] = raw.split('.');
  return { paise: BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2)) };
}

export function normalizePriceList(records, tiers) {
  const known = new Map(tiers.map((tier) => [tier.code.toUpperCase(), tier]));
  const seen = new Set();
  const results = records.map((record) => {
    const normalizedClass = record.rawClass.toUpperCase();
    if (!record.rawClass) return { ...record, classification: 'REJECTED', reason: 'CLASS_BLANK' };
    const parsed = parseMoneyToPaise(record.rawPrice);
    if (parsed.error) return { ...record, normalizedClass, classification: 'REJECTED', reason: parsed.error };
    if (!known.has(normalizedClass)) return { ...record, normalizedClass, normalizedPricePaise: parsed.paise, classification: 'REJECTED', reason: 'UNKNOWN_SEAT_CLASS' };
    if (seen.has(normalizedClass)) return { ...record, normalizedClass, normalizedPricePaise: parsed.paise, classification: 'DUPLICATE', reason: 'DUPLICATE_SEAT_CLASS' };
    seen.add(normalizedClass);
    return { ...record, normalizedClass, normalizedPricePaise: parsed.paise, tierId: known.get(normalizedClass)._id, classification: 'ACCEPTED' };
  });
  return { results, accepted: results.filter((record) => record.classification === 'ACCEPTED') };
}
