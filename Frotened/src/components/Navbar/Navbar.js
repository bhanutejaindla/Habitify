import React from 'react';
import './Navbar.css';
import {Link,useNavigate} from 'react-router-dom';
import SignUp from './../signup/SignUp';
import SignIn from './../signin/SignIn';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';

const Navbar = () => {
    const navigate=useNavigate();
    const logout=()=>{
        localStorage.removeItem("token");
        navigate("/");
    };
    return (
        <header className='header' >
            <div className='navbar-links' style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:"100vw",width:'90%',gap:'1000px',marginRight:'100px'}}>
                <div style={{display:'flex',flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}> 
                 <img style={{height:"70px",mixBlendMode:"multiply"}} src="https://play-lh.googleusercontent.com/NZKMWsJBtKHkeFPjDch23USSZZBefTWiiMsJDL27_Z-lEjqmW_vcMjsICeruY77QX-E" alt="logo" /> 
                <Link to="/DashBoard" className='navbar-link'>Dashboard</Link>
                <Link to="/analytics" className='navbar-link'>Analytics</Link>    
                </div>
                <div className='signout'>
                {localStorage.getItem("token")?
                    (<button onClick={logout} className='navbar-link'>
                        <LogoutIcon/>
                    </button>):(<Link to="/signin" className='navbar-link'>SignIn</Link>)
                }
                </div>   
            </div>
        </header>
    );
}

export default Navbar;
