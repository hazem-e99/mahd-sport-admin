import "./skeleton-table.scss";

const SkeletonTable = ({ rows = 5, columns = 8 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="skeleton-cell skeleton-header" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="skeleton-table-row">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div key={colIdx} className="skeleton-cell" />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonTable; 