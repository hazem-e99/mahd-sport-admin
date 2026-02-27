import type { TabsProps } from '@/types/SurveyResults.type';
import React from 'react';
import "./tabs.scss";

const Tabs: React.FC<TabsProps> = ({ tabs, selectedTab, handleTabChange }) => {
  console.log(tabs, 'selectedTab');
  return (
    <div className="mb-3">
      <ul className="nav nav-tabs mb-4">
        {tabs.map(tab => (
          <li key={tab.id} className="nav-item">
            <span
              className={`nav-link ${tab.label === selectedTab.label ? 'active' : ''}`}
              onClick={() => {
                handleTabChange(tab);
                // console.log(tab , 'tab');
              }}>
              {tab.label}
              {tab.count !== undefined && (
                <span className="tab-count-bracket"> ({tab.count})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;