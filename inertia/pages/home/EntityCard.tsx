import { m } from 'framer-motion'
import { ReactNode } from 'react'

interface EntityCardProps {
  index: number
  children: ReactNode
  onClick?: () => void
}

const EntityCard = ({ index, children, onClick }: EntityCardProps) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,122,0,0.1)]"
    >
      {children}
    </m.div>
  )
}

export default EntityCard
