import { motion, useReducedMotion } from 'framer-motion'

// Envuelve cada página: aparición suave y rápida al montarse.
export default function PageTransition({ children }) {
  const reduce = useReducedMotion()
  return (
    <motion.main
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.main>
  )
}
