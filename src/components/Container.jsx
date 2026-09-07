export default function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-shell px-5 sm:px-8 ${className}`}>{children}</div>
}
