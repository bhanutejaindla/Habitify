import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useNavigate} from  "react-router-dom";
import SectionInfo from '../SectionInfo/SectionInfo';


const Hero = () => {
    const navigate=useNavigate();
    const token=localStorage.getItem('token');
    const handleClick=()=>{
        if(token)
        {
            navigate('./DashBoard');
        }
        else
        {
            navigate('./SignIn');
        }
    }
    return (
        <Container maxWidth="md" sx={{
            textAlign: 'center',
            mt: 8,
            backgroundColor:'#f5fdf8'
        }}>
            <h1 style={{fontSize: '55px', fontWeight: '1'}}>The simplest Habit Tracker App to Manage Habits</h1>
            <Typography variant='h6' color="textSecondary" paragraph>
                Finally, a daily habit tracker that helps you do more, by doing less.
            </Typography>
            <Box sx={{ my: 4 }}>
                <Button
                    variant='contained'
                    color="success"
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    onClick={(e)=>handleClick()} 
                >Start DailyHabits today </Button>
            </Box>
            <img style={{height:'200px',width:'200px', mixBlendMode: 'multiply'}} src="https://thumbs.dreamstime.com/b/d-people-hit-target-icon-vector-logo-man-white-red-blue-dart-white-background-95700131.jpg" alt="" />
            <h2>Organize, Execute, Triumph</h2>
            <Typography variant='h6' color="textSecondary" paragraph>
            Start your day right with a clear, organized schedule that keeps you on track for success. Here’s an example of how your day with Habitify could look:
            </Typography>
            <SectionInfo/>
        </Container>
    );
}

export default Hero;
