import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Recommendataions.css';
import { purple } from '@mui/material/colors';
import { useHabitContext } from '../context/HabitContext';


const Recommendataions = () => {
    const { addHabit } = useHabitContext();
    const [flaskData, setFlaskData] = useState([]);
    const [habitData, setHabitData] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const Jwt_token = localStorage.getItem("token");

            if (!Jwt_token) return;
            try {
                const getRes = await axios.get('http://localhost:8080/getHabits', {
                    headers: {
                        "Authorization": Jwt_token,
                        "Content-Type": "Application/json"
                    }
                })
                console.log(getRes.data);
                const AllHabitsData = getRes.data;
                const AllHabits = AllHabitsData.map((habit) => {
                    return habit.habit_name;
                })
                const newObj = {
                    "user_habits": AllHabits.join(",")
                }
                const postRes = await axios.post('http://localhost:8081/generate-habit-suggestions', newObj);
                console.log(postRes);
                setFlaskData(postRes.data);
            }
            catch (error) {
                console.log("Error Loading details", error);
            }
        }
        fetchData();

    }, []);
    return (
        <div className="recommendation">
            <h1 style={{ textAlign: "center", color: "blue" }}>Recommendations</h1>
            {flaskData.map((data, index) => {
                return (
                    <div className="apiRecommendation" >
                        <div>
                            <p style={{ fontWeight: 300, color: "blueviolet" }} >{data.title}</p>
                            <p>{data.description}</p>
                        </div>
                        <div >
                            <button className='btn' onClick={() => { addHabit(data.title) }} >AddHabit</button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default Recommendataions;
