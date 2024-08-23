import { useState, useEffect, React } from 'react'
import { Link } from "react-router-dom";
import { RUTA_BACKEND } from "../../conf";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import "./style.css";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  //Table configs
  /*const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'orderNum', headerName: 'Order #', width: 70 },
    { field: 'orderDate', headerName: 'Date', width: 70 },
    { field: 'numProducts', headerName: '# of Products', width: 70 },
    { field: 'finalPrice', headerName: 'Order #', width: 70 },
    { field: 'OrderNum', headerName: 'Order #', width: 70 },
    { field: 'OrderNum', headerName: 'Order #', width: 70 },

  ]*/

  const httpGetAllOrders = async () => {
    console.log(RUTA_BACKEND);
    const resp = await fetch(`${RUTA_BACKEND}/Orders`);
    const data = await resp.json();
    console.log("Carrito carrito");
    console.log(data);
    setOrders(data);
  }

  const httpDeleteOrder = async (orderID) => {
    const data = {
      orderID: orderID
    };
    console.log("HOLAAA");
    await fetch(`${RUTA_BACKEND}/Order?orderID=${orderID}`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("deleted!");
    httpGetAllOrders();
  }

  useEffect(() => {
    httpGetAllOrders();
    document.title = 'My Orders';
  }, [])

  return (
    <>

      <Grid container spacing={2} display="flex" justifyContent="center"
        alignItems="center">
        <Grid item xs={8} >
          <h1> My Orders </h1>
        </Grid>
        <Grid item xs={3} >
          <Link to={"/"}> <Button variant="outlined"> Home </Button> </Link>
        </Grid>
      </Grid>

      <Grid container spacing={7} display="flex"
        justifyContent="center"
        alignItems="center">
        <Grid item xs={1}>
          ID
        </Grid>
        <Grid item xs={1}>
          Order #
        </Grid>
        <Grid item xs={2}>
          Date
        </Grid>
        <Grid item xs={2}>
          # Products
        </Grid>
        <Grid item xs={1}>
          Final Price
        </Grid>
        <Grid item xs={1}>
          Status
        </Grid>
        <Grid item xs={3}>
          Options
        </Grid>
      </Grid>

      {
        orders.map((singleOrder) =>
          <Grid container spacing={7} display="flex"
            justifyContent="center"
            alignItems="center">
            <Grid item xs={1}>
              {singleOrder.orderID}
            </Grid>
            <Grid item xs={1}>
              {singleOrder.orderNum}
            </Grid>
            <Grid item xs={2}>
              {singleOrder.orderDate}
            </Grid>
            <Grid item xs={2}>
              {singleOrder.numProducts}
            </Grid>
            <Grid item xs={1}>
              {singleOrder.finalPrice}
            </Grid>
            <Grid item xs={1}>
              {singleOrder.orderStatus}
            </Grid>
            <Grid item xs={3}>
              <IconButton aria-label="delete" color="error" onClick={() => httpDeleteOrder(singleOrder.orderID)}>
                <DeleteIcon />
              </IconButton>
              <Link to={`/add-order/${singleOrder.orderID}`}>
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Link>
            </Grid>
          </Grid>


        )}


    </>
  )
}

export default MyOrdersPage
