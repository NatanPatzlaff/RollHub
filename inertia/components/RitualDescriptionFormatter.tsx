import React from 'react'

interface RitualDescriptionFormatterProps {
  description: string
  className?: string
}

const RitualDescriptionFormatter: React.FC<RitualDescriptionFormatterProps> = ({ description, className = '' }) => {
  if (!description) return null

  const normalizedText = description.replace(/\r\n/g, '[BR]').replace(/\n/g, '[BR]')
  const blocks = normalizedText.split('[BR]').map(b => b.trim()).filter(b => b.length > 0)

  const PREFIX_REGEX = /^([A-Za-zÀ-ÖØ-öø-ÿ0-9\s\(\)\+]+):/

  return (
    <div className={className}>
      {blocks.map((block, idx) => {
        const match = block.match(PREFIX_REGEX)
        
        if (match) {
          const prefix = match[0]
          const rest = block.slice(prefix.length)
          
          return (
            <p key={idx} className="mb-4 text-sm leading-relaxed text-zinc-300 last:mb-0">
              <span className="text-amber-500 font-bold mr-1">
                {prefix}
              </span>
              {rest}
            </p>
          )
        }

        return (
          <p key={idx} className="mb-4 text-sm leading-relaxed text-zinc-300 last:mb-0">
            {block}
          </p>
        )
      })}
    </div>
  )
}

export default RitualDescriptionFormatter
