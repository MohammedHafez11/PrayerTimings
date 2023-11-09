/* eslint-disable no-unused-vars */
import React from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import moment from 'moment';
import { useState, useEffect } from 'react';
import "moment/dist/locale/ar-dz";

moment.locale("ar-dz");
export default function  Maincontent(){


  
  const prayersArray = [
    {key: "Fajr", displayName: "الفجر"},
    {key: "Dhuhr", displayName: "الظهر"},
    {key: "Asr", displayName: "العصر"},
    {key: "Maghrib", displayName: "المغرب"},
    {key: "Isha", displayName: "العشاء"},
  ]

   const [timings, setTimings] = useState({
             Fajr: "05:15",
             Dhuhr: "12:48",
             Asr: "16:16",
             Maghrib: "18:53",
             Isha: "20:11",
   });

  const [selectedCity, setSelectedCity] = useState({
    displayName: "القاهره",
    apiName: "Cairo",

  });


  useEffect(() =>{
    getTimings();
    
 }, [selectedCity])


  useEffect(() =>{

    let interval = setInterval(() =>{
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | hh:mm"));

    return () =>{
      clearInterval(interval);
    };
  }, [timings]);




   const setupCountdownTimer = () =>{
    const momentNow = moment();

    let PrayerIndex = 2;

    const Isha = timings["Isha"];
    const IshaMoment = moment(Isha, "hh:mm");
    if(
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ){
      PrayerIndex = 1;
    } else if(
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ){
      PrayerIndex = 2;
    }else if(
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ){
      PrayerIndex = 3;
    }else if(
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ){
      PrayerIndex = 4;
    }else {
      PrayerIndex = 0;
    }


    setnextPrayerIndex(PrayerIndex);
    
    const nextPrayerObject = prayersArray[PrayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    let durationRemainingTime = moment.duration(remainingTime);
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
    if(remainingTime < 0){
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss"));
      const totalDiffernce = midnightDiff + fajrToMidnightDiff;
      const remainingTime = totalDiffernce;
    }
    setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`);
    
   }


  const getTimings = async () =>{
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.apiName}&country=Egypt`
      );
      setTimings(response.data.data.timings);
  }



  const [remainingTime, setRemainingTime] = useState("");
  const [nextPrayerIndex, setnextPrayerIndex] = useState(2);
  const [today, setToday] = useState("");


  
  const avilabelCity = [
    {
      displayName: "القاهره",
      apiName: "Cairo",
  
    },
    {
      displayName: "الاسكندريه",
      apiName: "Alex",
  
    },
    {
      displayName: "الفيوم",
      apiName: "Fayoum",
  
    }
  ]

 

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    const cityObject = avilabelCity.find((city) =>{
      return city.apiName == event.target.value
    })
    setAge(event.target.value);
    setSelectedCity(cityObject);
  };


    return (
        <div>
        <Grid container>
        <Grid xs={8}>
          <div>
            <h3> {today} </h3>
            <h2> {selectedCity.displayName} </h2>
          </div>
        </Grid>
        <Grid xs={4}>
          <div>
            <h3> متبقي لصلاه {prayersArray[nextPrayerIndex].displayName} </h3>
            <h2>{remainingTime}</h2>
          </div>
        </Grid>
      </Grid>
      <Divider style={{borderColor: "white", opacity: "0.2"}} variant="middle" />
      <Stack style={{display: 'flex', flexWrap: 'wrap'}} direction="row" justifyContent={"space-around"} sx={{mt: 5}}>
      <Prayer name="صلاه الفجر"  time={timings.Fajr} image="https://images.squarespace-cdn.com/content/v1/5624f8eee4b0d232542ead5b/1474290009852-KAAEK193TG236ALIDKQ2/image-asset.jpeg"/>
      <Prayer name="صلاه الظهر"  time={timings.Dhuhr} image="https://onlinequranlessons.com/wp-content/uploads/2020/03/Zuhr-namaz__-300x169.jpg"/>
      <Prayer name="صلاه العصر"  time={timings.Asr} image="https://mrlatalib.com/chariaa/uploads/images/202306/image_750x_648b03eae39d6.jpg"/>
      <Prayer name="صلاه المغرب" time={timings.Maghrib} image="https://www.mymasjid.ca/wp-content/uploads/2020/05/sky-sunset-clouds-silhouette-87500-scaled.jpg"/>
      <Prayer name="صلاه العشاء" time={timings.Isha} image="http://farm3.static.flickr.com/2101/2189195596_eb014231da.jpg"/>
      </Stack>
      <Stack>
        <br/>
      <Box sx={{ width: "120px", background: "white", display: "block", margin: "auto", padding: "15px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">المدينه</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          {avilabelCity.map((city) =>{
            return (

              // eslint-disable-next-line react/jsx-key
              <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>

            );
          })}
          
        
        </Select>
      </FormControl>
    </Box>
      </Stack>
        </div>
    );
}

