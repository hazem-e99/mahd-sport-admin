import VerticalDotsIcon from '@/components/icons/vertical-dots-icon';
import type { SingleTabProps } from '@/types/single-tab.type';
import './single-tab.component.scss';

const SingleTab: React.FC<SingleTabProps> = ({ id, content, icon, isActive, handleClick }) => {
    return (
        <div key={id}
            className={`single-tab  ${isActive ? 'active' : ''}`}
            onClick={handleClick}>
            <div className="tab-content">
                <div className='tab-icon'> {icon}</div>
                <span className='tab-content-text px-3'>{content}</span>
            </div>
            <div className="options-btn">
                <VerticalDotsIcon />
            </div>
        </div>
    );
};

export default SingleTab;