import { motion, useReducedMotion } from 'framer-motion'

// Aparición al entrar en viewport: fade + slide-up sutil.
// <Reveal delay={0.1}>…</Reveal>
export default function Reveal({ children, delay = 0, y = 16, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
