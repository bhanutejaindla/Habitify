import React from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ViewProgress.css"; 

const ViewProgress = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const { habit, dates } = location.state;


  const calculateProgress = (range) => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - range);

    let completedDays = 0;

    habit.dates.forEach((date) => {
      const recordDate = new Date(date);
      if (recordDate >= startDate && recordDate <= today) {
        completedDays++;
      }
    });

    return completedDays;
  };

  const weeklyProgress = calculateProgress(7); 
  const monthlyProgress = calculateProgress(30); 

  return (
    <div className="view-progress">
      <h2>Progress for {habit.name}</h2>

      {/* Daily Progress */}
      <div className="daily-progress">
        <h3>Daily Progress</h3>
        {dates.map((date) => (
          <div key={date}>
            <strong>{date}:</strong> 
            <span className={habit.dates.includes(date) ? "completed" : "not-completed"}>
              {habit.dates.includes(date) ? "Completed" : "Not Completed"}
            </span>
          </div>
        ))}
      </div>

  
      <div className="progress-summary">
        <h3>Summary</h3>
        <p>
          <strong>Weekly Progress:</strong> {weeklyProgress} days completed out of 7 days.
        </p>
        <p>
          <strong>Monthly Progress:</strong> {monthlyProgress} days completed out of 30 days.
        </p>
      </div>

      <div className="streaks">
        <p>
          <strong>Current Streak:</strong> {habit.streak}
        </p>
        <p>
          <strong>Longest Streak:</strong> {habit.longestStreak}
        </p>
      </div>
    </div>
  );
};

export default ViewProgress;
