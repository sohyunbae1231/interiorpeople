import React from "react";
import "./ProgressBar.css";

/** percent 매개변수를 넘겨받음 */
const ProgressBar = ({ percent }) => {
  return (
    <div>
      <div className="progress-bar-boundary">
        {/* style을 통해 프로그레스 바를 동적으로 채워줌 */}
        <div style={{ width: `${percent || 0}%` }}>{percent}%</div>
      </div>
    </div>
  );
};

export default ProgressBar;
