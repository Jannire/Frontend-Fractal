import { useState } from 'react'
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';

function Home() {

  return (
    <>
      <h4 sx={{m : 5}}> Welcome to the homepage! </h4>
      <div>
        <Link to={"/my-orders"}> <Button variant="outlined"> My orders </Button> </Link>
        <Link to={"/add-order"}> <Button variant="outlined"> Add orders </Button> </Link>

      </div>
    </>
  )
}

export default Home
