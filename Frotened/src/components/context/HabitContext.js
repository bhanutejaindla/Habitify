import React,{createContext,useContext,useState} from 'react';

const HabitContext=createContext();

export const HabitProvider =({children})=>{
    const [habitNames,setHabitNames]=useState("");
    const addHabit =(habitName)=>{
        setHabitNames(habitName);
    }
    return (
        <HabitContext.Provider value={{habitNames,addHabit}}>
            {children}
        </HabitContext.Provider>
    )
}

export const useHabitContext=()=>{
    return useContext(HabitContext);
};