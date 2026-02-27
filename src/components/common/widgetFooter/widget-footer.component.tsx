import { Card } from 'react-bootstrap';
import './widget-footer.component.scss';

const WidgetFooter: React.FC<{ footer?: React.ReactNode }> = ({ footer }) => {
  if (!footer) return null;
  return <Card.Footer className="widget-footer">{footer}</Card.Footer>;
};
export default WidgetFooter;
