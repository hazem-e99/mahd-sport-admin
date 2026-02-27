import SvgRightArrow from '@/components/icons/right-arrow';
import './home-card.component.scss'
import type { HomeCardProps } from '@/types/home-card.type';
import { Link } from 'react-router';
import { useLanguage } from '@/context/languageContext';

const HomeCard: React.FC<HomeCardProps> = ({ title, desc, icon, urlToGo, onClick }) => {
    const { getValue } = useLanguage()

    const content = (
        <>
            <div className="home-card-container__side">{icon}</div>
            <div className="home-card-container__body">
                <h6 className='home-card-container__body-title mb-1'>{title}</h6>
                <p className='home-card-container__body-desc'>{desc}</p>
                <div className='home-card-container__body__button'>
                    <span className='home-card-container__body__button-text'>{getValue("view_details") || 'View Details'}</span>
                    <SvgRightArrow className='rtl:rotate-180' />
                </div>
            </div>
        </>
    )

    if (onClick && !urlToGo) {
        return (
            <button className="home-card-container" onClick={onClick}>
                {content}
            </button>
        )
    }

    if (urlToGo) {
        return (
            <Link className="home-card-container" to={urlToGo}>
                {content}
            </Link>
        )
    }

    return (
        <div className="home-card-container">
            {content}
        </div>
    )
}
export default HomeCard;
