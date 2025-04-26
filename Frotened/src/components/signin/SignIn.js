import React ,{useState}from 'react';
import { TextField, Button, Typography, Box, Container, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const validateForm = () => {
      let errors = {};
      if (!formData.email.trim()) errors.email = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = "Invalid email address.";
      if (!formData.password.trim()) errors.password = "Password is required.";
      return errors;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const validateErrors = validateForm();
      if (Object.keys(validateErrors).length > 0) {
        setErrors(validateErrors);
        setSuccessMessage("");
      } else {
        setErrors({});
        try {
          const response = await axios.post("http://localhost:8080/signin", formData);
  
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard"); 
          }
        } catch (error) {
          console.error("Error:", error.response?.data || error.message);
          setErrors({ apiError: error.response?.data?.message || "Signin failed." });
        }
      }
    };
  
    return (
      <Container maxWidth="sm" >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding:'10px',
            marginTop: 8,
            border:'none',
            borderRadius:'10px',
            bgcolor:'#323232'
          }}
        >
          <img style={{height:'50px',width:"50px",margin:'10px',borderRadius:'10px'}} src="https://play-lh.googleusercontent.com/NZKMWsJBtKHkeFPjDch23USSZZBefTWiiMsJDL27_Z-lEjqmW_vcMjsICeruY77QX-E" alt="" />
          <Typography variant="h4" component="h1" 
           sx={{
            color:'white',
           }}
          gutterBottom>
            Welcome To Habitify 
          </Typography>
          <Typography variant="body1" component="p" 
           sx={{
            color:'white',
            marginBottom:'1px'
           }}
          >
             Sign in to your account and start building good habits with Habitify  
          </Typography>
          {errors.apiError && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errors.apiError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "90%" }}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              margin="normal" 
              sx={{
                label:{color:'white'},
                input:{color:'white'},
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              margin="normal"
              sx={{
                label:{color:'white'},
                input:{color:'white'},
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{ marginTop: 2, cursor: "pointer", color: "red" }}
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign Up
          </Typography>
        </Box>
      </Container>
)}

export default SignIn;
