import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-curve disabled:opacity-50'

const sizes = {
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-7 py-3.5 text-base',
}

const variants = {
  primary:
    'afterimage bg-accent text-bg hover:bg-accent-dark hover:-translate-y-0.5',
  ghost:
    'border border-line-strong text-ink hover:border-ink hover:-translate-y-0.5',
  quiet: 'text-accent hover:text-accent-dark',
}

export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button className={cls} {...rest}>{children}</button>
}
