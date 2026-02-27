
import WidgetControlsBar from '@/components/common/widgetControlBar/widget-control-bar.component';
import WidgetFooter from '@/components/common/widgetFooter/widget-footer.component';
import WidgetHeader from '@/components/common/widgetHeader/widget-header.component';
import { Card } from 'react-bootstrap';


import React from 'react';
import type { WidgetProps } from '../../../types/widget.type.tsx';
import './widget.component.scss';

const Widget: React.FC<WidgetProps> = React.memo(
  ({
    id,
    content,
    positionX,
    positionY,
    widgetWidth,
    widgetHeight,
    noMove,
    noResize,
    handleClick,
    header,
    headerActions,
    searchComponent,
    sorterComponent,
    footer,
    className = '',
  }) => {
    const handleCardClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleClick?.();
    };

    return (
      <div
        className={`grid-stack-item ${className}`}
        gs-x={positionX}
        gs-y={positionY}
        gs-w={widgetWidth}
        gs-h={widgetHeight}
        gs-no-move={noMove}
        gs-no-resize={noResize}
        data-testid={`widget-${id}`}>
        <div className="grid-stack-item-content">
          <Card className="widget-card h-100">
            <WidgetHeader header={header} headerActions={headerActions} />
            <WidgetControlsBar
              searchComponent={searchComponent}
              sorterComponent={sorterComponent} />
            <Card.Body className="widget-body" onClick={handleCardClick}>
              <div className="widget-content">{content}</div>
            </Card.Body>
            <WidgetFooter footer={footer} />
          </Card>
        </div>
      </div>
    );
  }
);

Widget.displayName = 'Widget'; // This helps with debugging in React DevTools
export default Widget;