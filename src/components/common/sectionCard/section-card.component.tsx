import type { SectionCardProps } from '@/types/section-card.type'
import './section-card.component.scss'

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, hasButtonAction, className = "", onAction, buttonName }) => {
  return (
    <div className={`mb-3 section-card-wrapper ${className}`}>
      {/* Header */}
      <div className="section-card-header">
        <div className="">
          {icon && <div className="section-card-icon">{icon}</div>}
          <h3 className="section-card-title">{title}</h3>
        </div>
        {hasButtonAction && (<button className='main-button' onClick={onAction}>{buttonName}</button>)}
      </div>
      <div className="section-card-divider" />
      {/* Body */}
      <div className="section-card-body h-100">
        {children}
      </div>
    </div>
  )
}

export default SectionCard