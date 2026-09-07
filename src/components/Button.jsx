import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition duration-200 ease-curve focus-visible:outline-2 disabled:opacity-50'

const sizes = {
  md: 'px-5 py-2.5',
  lg: 'px-7 py-3.5',
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 shadow-card',
  ghost: 'border border-line text-ink hover:bg-surface-2 hover:-translate-y-0.5',
  quiet: 'text-primary hover:text-primary-dark',
}

export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button className={cls} {...rest}>{children}</button>
}
