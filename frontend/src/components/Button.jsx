export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = variant === 'secondary'
    ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
    : 'bg-ink text-white hover:bg-slate-800';
  return <button className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles} ${className}`} {...props}>{children}</button>;
}
