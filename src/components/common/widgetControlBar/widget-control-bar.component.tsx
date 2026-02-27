import './widget-control-bar.component.scss';

const WidgetControlsBar: React.FC<{
    searchComponent?: React.ReactNode;
    sorterComponent?: React.ReactNode;}> = ({ searchComponent, sorterComponent }) => {
    if (!searchComponent && !sorterComponent) return null;

    return (
        <div className="widget-controls-bar">
            <div className="widget-controls">
                {searchComponent && (
                    <div className="search-wrapper">{searchComponent}</div>
                )}
                {sorterComponent && (
                    <div className="sorter-wrapper">{sorterComponent}</div>
                )}
            </div>
        </div>
    );
};
export default WidgetControlsBar;