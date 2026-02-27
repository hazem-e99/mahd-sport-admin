import { Card } from 'react-bootstrap';
import './widget-header.component.scss';

const WidgetHeader: React.FC<{ header?: React.ReactNode; headerActions?: React.ReactNode; }> = ({ header, headerActions }) => {
    if (!header && !headerActions) return null;

    return (
        <Card.Header className="widget-header">
            {header && <div className="widget-title">{header}</div>}
            {headerActions && <div className="widget-actions">{headerActions}</div>}
        </Card.Header>
    );
};
export default WidgetHeader;