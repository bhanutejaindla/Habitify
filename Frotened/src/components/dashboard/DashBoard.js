import  React,{ useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; 
import "./DashBoard.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import Recommendataions from "../recommendataions/Recommendataions.js";
import { useHabitContext } from "../context/HabitContext.js";
import DeleteIcon from '@mui/icons-material/Delete';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';



const API_URL = process.env.API_URL;

const DashBoard = () => {
  const { habitNames } = useHabitContext();
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const navigate = useNavigate();

  const handleDelete = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Perform the delete action here, e.g., API call
      removeHabit(itemId);
      console.log(`Deleting item with ID: ${itemId}`);
    } else {
      // User cancelled the delete action
      console.log("Delete cancelled.");
    }
  };
  useEffect(() => {
    const addData = async () => {
      if (habitNames.length === 0) return;
      const addHabitObj = {
        name: habitNames,
        dates: [],
      };
      console.log(addHabitObj);
      const JWT_token = await localStorage.getItem('token');;
      try {
        const res = await axios.post('http://localhost:8080/addNewHabit', addHabitObj, {
          headers: {
            "Authorization": JWT_token,
            "Content-Type": "application/json",
          }
        });
      
      }
      catch (err) {
        console.log("Error", err);
      }
    };
    addData();
  }, [habitNames]);
  useEffect(() => {
    const fetchData = async () => {
      const JWT_token = await localStorage.getItem('token');
      if (!JWT_token) return;
      try {
        const res = await axios.get("http://localhost:8080/getHabits", {
          headers: {
            "Authorization": JWT_token,
            "Content-Type": "application/json",
          },
        });
        const AllHabitsData = res.data;
        const FormattedHabits = AllHabitsData.map((habit) => ({
          id: habit.habit_id,
          name: habit.habit_name,
          dates: JSON.parse(habit.dates),
          streak: 0,
          longestStreak: 0,
        }));
        const today = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          days.push(date.toISOString().split("T")[0])
        }
        setDates(days);
        FormattedHabits.map(habit => {
          let currentStreak = 0;
          let longestStreak = 0;
          let streak = 0;
          const Dates = [];

          days.forEach((date) => {
            console.log(habit.dates, date);
            if (Array.isArray(habit.dates) && habit.dates.includes(date)) {
              streak++;
              currentStreak = streak;
              if (streak > longestStreak) {
                longestStreak = streak;
              }
            } else {
              streak = 0;
            }
          });
          habit.streak = currentStreak;
          habit.longestStreak = longestStreak;
          return habit;
        })
        console.log(FormattedHabits);
        setHabits(FormattedHabits);
      }
      catch (err) {
        console.log("Error Fetching Habits", err);
      }
    };
    fetchData();
  }, [habitNames]);






  const addHabit = async () => {
    if (newHabit.trim() === "") return;
    const addHabitObj = {
      name: newHabit ,
      dates: [],
    };
    console.log(addHabitObj);
    const JWT_token = await localStorage.getItem('token');
    console.log(JWT_token);
    if (!JWT_token) return;
    try {
      const res = await axios.post('http://localhost:8080/addNewHabit', addHabitObj, {
        headers: {
          "Authorization": JWT_token,
          "Content-Type": "application/json",
        }
      });
      console.log(res.data);
      setHabits([
        ...habits,
        {
          id: res.data.habit_id,
          name: newHabit,
          dates: [],
          streak: 0,
          longestStreak: 0,
        },
      ]);
      setNewHabit("");
    }
    catch (error) {
      console.log("Error", error);
    }
  };


  const removeHabit = async (id) => {
    const Jwt_token = await localStorage.getItem("token");
    if (!Jwt_token) return;
    try {
      const res = await axios.delete(`http://localhost:8080/removeHabits/${id}`, {
        headers: {
          "Authorization": Jwt_token,
          "Content-Type": "application/json",
        }
      })
      setHabits(habits.filter((habit) => habit.id !== id));
      console.log(res.data);
    }
    catch (err) {
      console.error("Error deleting habit", err);
    }
  };



  const toggleRecord = async (habitIndex, date) => {
    const updatedHabits = [...habits];
    const habit = updatedHabits[habitIndex];
    const dateObj = new Date(date);
    const dateStr = dateObj.toISOString().split("T")[0];
    const datesArray = Array.isArray(habit.dates) ? habit.dates : JSON.parse(habit.dates);
    console.log(habit);
    const isCompleted = habit.dates.includes(dateStr);
    const newDates = isCompleted ? datesArray.filter(d => d !== dateStr) : [...habit.dates, dateStr];
    habit.dates = newDates;
    updateStreak(habit);
    console.log(habit.streak);
    const newHabitObj = {
      name: habit.name,
      Dates: JSON.stringify(habit.dates),
    };
    console.log(newHabit);

    const JWT_token = await localStorage.getItem('token');
    console.log(JWT_token);
    if (!JWT_token) return;
    console.log("hello", newHabitObj);
    try {
      const res = await axios.post('http://localhost:8080/updateHabit', newHabitObj, {
        headers: {
          "Authorization": JWT_token,
          "Content-Type": "application/json",
        }
      });
      console.log(res.data);
      setHabits(updatedHabits);
    }
    catch (err) {
      console.log("Error updating habit", err);
    }
  };

  const updateStreak = (habit) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    const Dates = [];

    dates.forEach((date) => {
      if (Array.isArray(habit.dates) && habit.dates.includes(date)) {
        streak++;
        
        if (streak > longestStreak) {
          longestStreak = streak;
        }
      } else {
        streak = 0;
      }
    });
    for(let i=dates.length-1;i>=0;i--)
    {
      if(Array.isArray(habit.dates) && habit.dates.includes(dates[i]))
      {
        currentStreak++;
      }
      else
      {
        break;
      }
    }
    habit.streak = currentStreak;
    habit.longestStreak = longestStreak;
  };

  return (
    <div>

      <div className="Navbar">
        <Navbar />
      </div>

      <div className="habit-tracker">
        <div className="add-habit">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit"
          />
          <button onClick={addHabit}>Add Habit</button>
        </div>
        <div className="header">
          <div className="header-cell">Habits</div>
          {dates.map((date) => (
            <div key={date} className="header-cell">
              {new Date(date).toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
            </div>
          ))}
          <div className="header-cell">Streak</div>
          <div className="header-cell">Longest</div>
        </div>
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="habit-row"
            onClick={() => navigate(`/progress/${habit.id}`, { state: { habit, dates } })}
          >
            <div className="wrapper">
              <div style={{marginLeft:'0px'}}>
              <Button onClick={(e)=>{ 
                e.stopPropagation();
                handleDelete(habit.id)
                }}>
  <DeleteIcon/>
  </Button>
            
              </div>
              <div className="habit-name">
                {habit.name}
              </div>
            </div>
            {dates.map((date) => {
              const dateStr = new Date(date).toISOString().split("T")[0];
              const isCompleted = habit.dates.includes(dateStr);

              return (
                <div
                  key={date}
                  className={`habit-cell ${isCompleted ? "completed" : "not-completed"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRecord(habits.indexOf(habit), date);
                  }}
                ></div>
              )
            })}
            <div className="habit-streak">{habit.streak}</div>
            <div className="habit-longest">{habit.longestStreak}</div>
          </div>
        ))}
      </div>
      <div className="color-code" style={{display:'flex',justifyContent:'flex-end',flexDirection:'row',gap:'10px',marginRight:'120px',marginTop:'10px'}}>
        <div style={{display:'flex',justifyContent:'center',flexDirection:'row',alignItems:'center',gap:'10px'}}>
        <div style={{height:'33px',width:'30px',backgroundColor:'pink'}}></div>
        <p className="color-completed">Completed</p>
        </div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'row',gap:'15px',}}>
        <div style={{height:'33px',width:'30px',backgroundColor:'green'}}></div>
        <p className="color-notcompleted">Not Completed</p>
        </div>
      </div>
      <div>
        <Recommendataions />
      </div>

    </div>
  );
};

export default DashBoard;
