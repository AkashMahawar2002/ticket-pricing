export function Amount({ paise }) { return <span>₹{(Number(paise || 0) / 100).toFixed(2)}</span>; }
