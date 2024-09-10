import React, { useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Label } from "recharts";
import { useContext } from "react";
import { Score_Data } from "../Dashboard";
import '../../Elements/Dashboard.css'

const Profile = () => {
  const { Score, setScore, isProfileClicked } = useContext(Score_Data);
  const RADIAN = Math.PI / 180;
  const data = [
    { name: "Average", value: 50, color: "#900D09" },
    { name: "Good", value: 30, color: "#CC7722" },
    { name: "Excellent", value: 20, color: "#008080" },
  ];
  const cx = 150;
  const cy = 200;
  const iR = 100;
  const oR = 150;
  const value = Score;
  

  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke="none"
        fill={color}
      />,
      
    ];
  };

  return (
    <div className="score-wrapper">
      <div className="score-title">
        Your Profile Score is <br/><span>{Score}</span>
        </div>
        <div className="profile-graph">
          <PieChart width={350} height={300}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx={cx}
              cy={cy}
              innerRadius={iR}
              outerRadius={oR}
              fill="#8884d8"
              stroke="none"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color}></Cell>
              ))}
              {/* Add custom label for each segment */}
             

            </Pie>
            {needle(value, data, cx, cy, iR, oR, "#d0d000")}
          </PieChart>
        </div>
    </div>
  );
};

export default Profile;
