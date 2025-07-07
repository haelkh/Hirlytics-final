import React from "react";
import "./StatsCards.css";

interface StatCard {
  title: string;
  value: string;
  icon: string;
  changeRate: string;
  period: string;
}

interface StatsCardsProps {
  stats: StatCard[];
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const getChangeClass = (changeRate: string): string => {
    if (changeRate.toLowerCase().includes("decrease")) {
      return "decrease";
    }
    if (changeRate.toLowerCase().includes("increase")) {
      return "increase";
    }
    return "no-change";
  };

  return (
    <div className="admin-stats-sidebar">
      {stats.map((stat, index) => (
        <div key={index} className="admin-stats-card">
          <div className="admin-stats-header">
            <img
              src={stat.icon}
              alt={`${stat.title} icon`}
              className="admin-stats-icon"
            />
            <div className="admin-stats-title">{stat.title}</div>
          </div>
          <div className="admin-stats-value">{stat.value}</div>
          <div className="admin-stats-change">
            <span className={getChangeClass(stat.changeRate)}>
              {stat.changeRate}
            </span>
          </div>
          <div className="admin-stats-period">{stat.period}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
