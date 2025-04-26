// import React from 'react';
// import { Grid, Paper, Box, Container, Typography,Divider} from '@mui/material';


// const SectionInfo = () => {
//     const habits={
//         Morning:[{name:"Run",time:'8 AM'},{name:"Medidate",time:"8.30 AM"},{name:"Plane the day",time:"9 AM"},{name:"Read",time:"10 AM"},{name:"Hydrate",time:"9.30 AM  "}],
//         Noon:[{name:"Healthy Lunch",time:"12 PM"},{name:"Connect with a colleague",time:"2 PM"},{name:"Express gratitude",time:"4 PM "}],
//         Night:[{name:'Reflect',time:"8 PM"},{name:'Wind Down',time:"9 PM"},{name:'Disconnect from screens',time:"9.30 PM"},{name:"Prepare for tomorrow",time:"10 PM"}]
//     }
//     return (
//        <Box sx={{width:'100%',minHeight:'100vh'}} >
//          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//             <Grid item md={4} >
//             <Paper elevation={3} style={{padding:'10px',width:'100%',height:'450px'}}>
//              <Paper  style={{backgroundColor:'#1085f1',color:'white',height:'40px'}}>
//             <Typography variant="h6">Morning</Typography>
//             </Paper>
//              {habits.Morning.map((habit,index) =>(
//               <Box>
//                 <Paper style={{border:'2px solid #1085f1',margin:'15px',height:'60px'}} elevation={0}>
//                 <Typography variant="body1" component="h4">{habit.name}</Typography>
//                 <Typography variant="body1" component="p">{habit.time}</Typography>
//                 </Paper>   
//               </Box>
//              ) )}
//             </Paper>
//             </Grid>
//             <Grid item md={4}>
//             <Paper elevation={3} style={{padding:'10px',width:'100%',height:'450px'}}> 
//             <Paper style={{backgroundColor:'#f16110',color:'white',height:'40px'}}>
//             <Typography variant="h6" >AfterNoon</Typography>
//             </Paper>
//             {habits.Noon.map((habit,index) =>(
//               <Box>
//                 <Paper style={{border:'2px solid #f16110',margin:'15px',height:'60px'}} elevation={0}>
//                 <Typography variant="body1">{habit.name}</Typography>
//                 <Typography variant="body1">{habit.time}</Typography>
//                 </Paper>   
//               </Box>
//              ) )}
//              </Paper>
//             </Grid>
//             <Grid item md={4}>
//             <Paper elevation={3} style={{padding:'10px',width:'100%',height:'450px'}}> 
//             <Paper style={{backgroundColor:'#8129f1',color:'white',height:'40px'}}>
//             <Typography variant="h6" >Evening</Typography>
//             </Paper>
//             {habits.Night.map((habit,index) =>(
//               <Box>
//                 <Paper style={{border:'2px solid #8129f1',margin:'15px',height:'60px'}} elevation={0}>
//                 <Typography variant="body1" component="h5">{habit.name}</Typography>
//                 <Typography variant="body1" component="p">{habit.time}</Typography>
//                 </Paper>   
//               </Box>
//              ) )}
//              </Paper>
//             </Grid>
//          </Grid>
//        </Box>
//     );
// }

// export default SectionInfo;

import React from 'react';
import { Grid, Paper, Box, Container, Typography,Divider} from '@mui/material';
import '@fontsource/poppins'; 

const habits = {
  Morning: [
    { name: "Run", time: "8 AM" },
    { name: "Meditate", time: "8:30 AM" },
    { name: "Plan the day", time: "9 AM" },
    { name: "Read", time: "10 AM" },
    { name: "Hydrate", time: "9:30 AM" }
  ],
  Noon: [
    { name: "Healthy Lunch", time: "12 PM" },
    { name: "Connect with a colleague", time: "2 PM" },
    { name: "Express gratitude", time: "4 PM" },
    { name: "Play Badminton",time:"5 PM"}
  ],
  Night: [
    { name: "Reflect", time: "8 PM" },
    { name: "Wind Down", time: "9 PM" },
    { name: "Disconnect from screens", time: "9:30 PM" },
    { name: "Prepare for tomorrow", time: "10 PM" }
  ]
};

const SectionInfo = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 5, backgroundColor: '#f9fafb',fontFamily:'Poppins,Sans-serif' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
      
          {Object.entries(habits).map(([period, habitList], idx) => {
            const colors = {
              Morning: '#1085f1',
              Noon: '#f16110',
              Night: '#8129f1',
            };

            return (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ backgroundColor: colors[period], p: 2 }}>
                    <Typography variant="P" align="center" color="white" fontWeight="bold">
                      {period === "Noon" ? "Afternoon" : period}
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1}}>
                    {habitList.map((habit, index) => (
                      <React.Fragment key={index}>
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="500">{habit.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{habit.time}</Typography>
                      </Box>
                      {index !== habitList.length - 1 && <Divider sx={{ bgcolor: 'rgba(128,128,128,0.4)',width:'60%',mx:'auto',my:1 }} />}
                    </React.Fragment>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default SectionInfo;
