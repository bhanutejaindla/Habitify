import React, { useEffect, useState } from 'react';
import { TextField,Button,Typography,Box,Container,Alert } from '@mui/material';
import  axios from 'axios';
import { useNavigate } from 'react-router-dom'; 



const SignUp = () => {
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
    });
    const[errors,setErrors]=useState({});
    const[successMessage,setSuccessMessage]=useState("");

  
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    }
    const validateForm=()=>{
        let errors={};
        if(!formData.name.trim()) errors.name="Name is Required";
        if(!formData.email.trim()) errors.email="Email is Required";
        else if(!/\S+@\S+\.\S+/.test(formData.email))
            errors.email="Invalid email address.";
        if(!formData.password) errors.password ="Password is Required";
        else if(formData.password.length<6)
            errors.password="Password must be at least 6 characters long.";
        return errors;  
    }
    const handleSubmit =async (e)=>{
        e.preventDefault();
        const validateErrors=validateForm();
        if(Object.keys(validateErrors).length>0)
        {
            setErrors(validateErrors);
            setSuccessMessage("");
        }
        else
        {
            setErrors({});
            try{
                console.log(formData);
                const response=await axios.post("http://localhost:8080/signup",formData,{
                    headers:{'Content-Type':'application/json'}
                });
                setSuccessMessage(response.data.message);
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
                setFormData({name:"",email:"",password:""});
            }
            catch(error)
            {
                console.log("Error:",error.response.data);
                setErrors({apiError:error.response.data.message});
            }
        }

    }
  return (
   <Container maxWidth="sm">
    <Box
      sx={{
        display:"flex",
        flexDirection:"column",
        padding:'10px',
        alignItems:"center",
        marginTop:8,
        border:'none',
        borderRadius:'10px',
        bgcolor:'#323232'
      }}
    >
        <img style={{height:'50px',width:"50px",margin:'10px',borderRadius:'10px'}} src="https://play-lh.googleusercontent.com/NZKMWsJBtKHkeFPjDch23USSZZBefTWiiMsJDL27_Z-lEjqmW_vcMjsICeruY77QX-E" alt="" />
        <Typography 
        variant="h4" 
        component="h1" 
        sx={{
        color:'white',
        }}
        gutterBottom>
        Welcome To Habitify 
        </Typography>
        <Typography
        variant="body1" 
        component="p" 
        sx={{
        color:'white',
        marginBottom:'1px'
        }}
        >
        Sign in to your account and start building good habits with Habitify  
        </Typography>
        {successMessage && (
            <Alert severity='success' sx={{marginBottom:2}}>{successMessage}</Alert>
        )}
        {errors.apiError && (
            <Alert severity='error' sx={{marginBottom:2}}>{errors.apiError}</Alert>
        )
        }
        <Box component="form" onSubmit={handleSubmit} sx={{width:"100%"}}>
            <TextField
             label="Name"
             name="name"
             value={formData.name}
             onChange={handleChange}
             error={!!errors.name}
             helperText={errors.name}
             fullWidth
             margin='normal' 
            sx={{
            label:{color:'white'},
            input:{color:'white'},
            }}
             />
             <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              margin='normal' 
              sx={{
              label:{color:'white'},
              input:{color:'white'},
              }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                onChange={handleChange}
                value={formData.password}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                margin='normal'
                sx={{
                label:{color:'white'},
                input:{color:'white'},
                }}
                />
                <Button
                type="submit"
                variant='contained'
                color='primary'
                fullWidth
                sx={{marginTop:2}}
                >SignUp</Button>
        </Box>
    </Box>
   </Container>
  );
}

export default SignUp;
