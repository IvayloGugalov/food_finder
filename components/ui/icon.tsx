import { iconPaths } from '@/lib/icons'
import { HTMLAttributes } from 'react'

type Properties = {
  id?: string
  icon: keyof typeof iconPaths
  color?: string
  gradient?: boolean
  size?: string
  [key: string]: any
}

const Icon = ({ id, icon, color, gradient, size = '40', ...properties }: Properties) => {
  const iconPath = iconPaths[icon]
  const gradientId = 'icon-gradient-' + Math.round(Math.random() * 10e12).toString(36)

  return (
    <div {...properties}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 256 256'
        aria-hidden='true'
        stroke={gradient ? `url(#${gradientId})` : color}
        fill={gradient ? `url(#${gradientId})` : color}
      >
        <g id={id} dangerouslySetInnerHTML={{ __html: iconPath }} />
      </svg>
    </div>
  )
}

export default Icon
