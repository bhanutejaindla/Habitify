import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Analytics.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,LabelList } from "recharts";

const Analytics = () => {
  const[habits,setHabits]=useState([]);
  const[dates,setDates]=useState([]); 
  const[loading,setLoading]=useState(true);
  useEffect(()=>{
    const fetchHabitData=async()=>{
      const Jwt_token=await localStorage.getItem("token");
      if(!Jwt_token) return ;
      try{
        const res=await axios.get("http://localhost:8080/getHabits",{
          headers:{
            "Authorization":Jwt_token,
            "Content-Type":"Application/json"
          }
        })
        const AllHabits=res.data;
        const today=new Date();
        const last7Days=[];
        const last30days=[];
        for(let i=0;i<30;i++)
        {
          const date=new Date(today);
          date.setDate(today.getDate()-i);
          if(i<7) last7Days.push(date.toISOString().split("T")[0]);
          last30days.push(date.toISOString().split("T")[0]);
        }
        setDates({last7Days,last30days});
        const FormattedHabits=AllHabits.map((habit)=>{
          return{
            id:habit.habit_id,
            name:habit.habit_name,
            dates: Array.isArray(habit.dates)?habit.dates:JSON.parse(habit.dates),
          };
        });
        setHabits(FormattedHabits);
        setLoading(false);
      }
      catch(err)
      {
        console.log("Error fetching habits",err);
        setLoading(false);
      }
    };
    fetchHabitData();
  },[]);

  const calculateCompletionPercentage=(habit,periodDates)=>
  {
    const completedDays=habit.dates.filter((date)=>periodDates.includes(date)).length;
    return (completedDays/periodDates.length)*100;
  }
  const getDataForBarChart=(period)=>{
    const labels=habits.map((habit)=>habit.name);
    const data=habits.map((habit)=>calculateCompletionPercentage(habit,period));
    console.log(data);
    console.log(labels);
    return labels.map((label,index)=>({
      name:label,
      percentage:data[index],
    }))
  };
  if(loading){
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className='analytics-page'>
      <h2>Analytics</h2>
      <div className='bar-graph'>
        <h3>Last 7 days</h3>
        <ResponsiveContainer width="70%" height={300}>
          <BarChart  data={getDataForBarChart(dates.last7Days)}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="name" />
           <YAxis/>
           <Tooltip/>
           <Legend
           layout="horizontal"
           verticalAlign="top"
           align="center"
           formatter={(value)=><span style={{color:'#8884d8'}}>{value}</span>}
           />
           <Bar dataKey="percentage" fill="#8884d8"> 
              </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='bar-graph'>
        <h3>Last 30 days</h3>
        <ResponsiveContainer width="70%" height={300}>
          <BarChart  data={getDataForBarChart(dates.last30days)}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="name" />
           <YAxis/>
           <Tooltip/>
           <Legend
           layout="horizontal"
           verticalAlign="top"
           align="center"
           formatter={(value)=><span style={{color:'#8884d8'}}>{value}</span>}
           />
           <Bar dataKey="percentage" fill="#8884d8"> 
              </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
