import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import { RUTA_BACKEND } from "../../conf";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Modal, Select, MenuItem, InputLabel,
  IconButton
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function OrderPage() {
  const { id } = useParams();
  const isIdPresent = id !== undefined;

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleOpen2 = () => setOpen2(true);

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  const [product, setProduct] = useState('1');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [finalPriceALL, setFinalPriceALL] = useState(0);
  const [finalPriceSingle, setFinalPriceSingle] = useState(0);
  const [QuantityAllSeperate, setQuantityAllSeperate] = useState([]);
  const [PriceAllSeperate, setPriceAllSeperate] = useState([]);
  const [numProducts, setNumProducts] = useState(0);
  const [orderNum, setOrderNum] = useState(0);
  const [allProdID, setAllProdID] = useState([]);
  const [allProdObj, setAllProdObj] = useState([]);

  const [dateToday, setDateToday] = useState(new Date());

  const handleChange = async (event) => {
    console.log("SELECCION!!!");
    setProduct(event.target.value);
    console.log(product);
    const prr = await httpGetSingleProduct(event.target.value);
    console.log(prr);
    setPrice(prr.price);
  };

  const handleQuantity = (e) => {
    setQuantity(() => e.target.value);
    console.log("quantity: " + quantity);
  }

  const onSave = () => {
    setAllProdID((v) => [...v, product]);
    setAllProdObj((v) => [...v, products.find((p) => p.productID === product)]);
    console.log(product)
    setFinalPriceSingle(price * quantity);
    console.log("SAVE");
    console.log(allProdID);
    setQuantityAllSeperate((v) => [...v, parseInt(quantity)]);
    setPriceAllSeperate((v) => [...v, price * quantity])
    console.log("ALL PRICES: ");
    console.log(PriceAllSeperate);

    handleClose();
  }

  const createOrder = () => {
    if (isIdPresent) {
      httpModifyOrder();
    }
    else {
      httpCreateOrder();
    }
  }

  const httpCreateOrder = async () => {
    const data = {
      orderNum: orderNum,
      orderDate: dateToday,
      numProducts: QuantityAllSeperate.reduce((accumulator, currentValue) => accumulator + currentValue,
        0),
      finalPrice: PriceAllSeperate.reduce((accumulator, currentValue) => accumulator + currentValue,
        0),
      ids: allProdID,
      quants: QuantityAllSeperate
    }
    const resp = await fetch(
      `${RUTA_BACKEND}/Order`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
    console.log("wait")
    const dataResp = await resp.json()

    if (dataResp.error !== "") {
      console.error(dataResp.error)
    }
    console.log("Added");
    console.log(dataResp);
    return dataResp;
  }

  const httpModifyOrder = async () => {
    const data = {
      orderID: id,
      orderNum: orderNum,
      orderDate: dateToday,
      numProducts: QuantityAllSeperate.reduce((accumulator, currentValue) => accumulator + currentValue,
        0),
      finalPrice: PriceAllSeperate.reduce((accumulator, currentValue) => accumulator + currentValue,
        0),
      ids: allProdID,
      quants: QuantityAllSeperate
    }
    const resp = await fetch(
      `${RUTA_BACKEND}/Order`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
    console.log("wait")
    const dataResp = await resp.json()

    if (dataResp.error !== "") {
      console.error(dataResp.error)
    }
    console.log("Modified");
    console.log(dataResp);
    return dataResp;
  }

  const httpGetSingleProduct = async (productID) => {
    console.log(productID);
    const resp = await fetch(`${RUTA_BACKEND}/Product?productID=${productID}`);
    const data = await resp.json();
    console.log("Get single PRD");
    console.log(data);
    return data;
  }

  const httpGetAllProducts = async () => {
    console.log(RUTA_BACKEND);
    const resp = await fetch(`${RUTA_BACKEND}/Products`);
    const data = await resp.json();
    console.log("Get all PRD");
    console.log(data);
    setProducts(data);

    console.log("ID!!!!!");
    console.log(id);
  }

  const httpGetSingleOrder = async () => {
    const resp = await fetch(`${RUTA_BACKEND}/Order/${id}`);
    const data = await resp.json();
    console.log("Get order!");
    console.log(data);
    setOrderNum(data.orderNum);
    setDateToday(new Date(data.orderDate));
    setQuantityAllSeperate(data.listProdsOrd.map((val) => val.Quantity))
    console.log(data.listProdsOrd.map((val) => val.Quantity * data.listProducts[data.listProducts.findIndex((p) => (p.productID === val.productID))]))
    setPriceAllSeperate(data.listProdsOrd.map((val) => val.Quantity * data.listProducts[data.listProducts.findIndex((p) => (p.productID === val.productID))].price))

    setAllProdID(data.listProdsOrd.map((val) => val.productID));
    setAllProdObj(data.listProducts);
  }

  const delProd = (index) => {
    const newArray = allProdObj.filter((item, idx) => idx !== index);
    setAllProdObj(newArray);
    console.log(allProdObj);
    const newArray1 = QuantityAllSeperate.filter((item, idx) => idx !== index);
    setQuantityAllSeperate(newArray1);
    const newArray2 = PriceAllSeperate.filter((item, idx) => idx !== index);
    setPriceAllSeperate(newArray2);
  }

  useEffect(() => {
    httpGetAllProducts();
    if (isIdPresent) {
      httpGetSingleOrder();
    }
    document.title = 'My Orders';
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid lightblue',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Grid container spacing={2} display="flex" justifyContent="center"
        alignItems="center">
        <Grid item xs={8} >
          <h1> Add your orders </h1>
        </Grid>
        <Grid item xs={3} >
          <Link to={"/"}> <Button variant="outlined"> Home </Button> </Link>
        </Grid>
      </Grid>




      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add new product
          </Typography>
          <Grid container spacing={2} display="flex" justifyContent="center"
            alignItems="center">
            <Grid item xs={12}>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Choose a new product to add:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="demo-simple-select-label">Product</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={product}
                label="Product"
                onChange={handleChange}
              >
                {products.map((pr) =>
                  <MenuItem key={pr.productID} value={pr.productID}>{pr.productName}</MenuItem>
                )}
              </Select>

              <TextField id="standard-basic" sx={{ ml: 2 }} label="Quantity" variant="standard" value={quantity} onChange={handleQuantity} />
            </Grid>
            <Grid item xs={12}>
              <TextField id="standard-basic" label="Final Price" variant="standard" InputProps={{
                readOnly: true,
              }} value={price * quantity} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" sx={{ mr: 1, mt: 1 }} onClick={onSave} > Save </Button>
              <Button variant="outlined" sx={{ mt: 1 }} onClick={handleClose}> Cancel </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>


      <Grid container spacing={2} display="flex" justifyContent="center"
        alignItems="center">
        <Grid item xs={3} >
          Order Number:
        </Grid>
        <Grid item xs={9}>
          <TextField id="standard-basic" label="Order Number" variant="standard" value={orderNum} onChange={(e) => setOrderNum(e.target.value)} />
        </Grid>

        <Grid item xs={3}>
          Order Date:
        </Grid>
        <Grid item xs={9}>
          <TextField id="standard-basic" label="Order Date" variant="standard" InputProps={{
            readOnly: true,
          }} value={dateToday.getDate() + "/" + dateToday.getMonth() + "/" + dateToday.getFullYear()} />
        </Grid>

        <Grid item xs={3}>
          Number of Products:
        </Grid>
        <Grid item xs={9}>
          <TextField id="standard-basic" label="# of Products" variant="standard" InputProps={{
            readOnly: true,
          }} value={QuantityAllSeperate.reduce((accumulator, currentValue) => accumulator + currentValue,
            0)
          } />
        </Grid>

        <Grid item xs={3}>
          Final Price:
        </Grid>
        <Grid item xs={9}>
          <TextField id="standard-basic" label="Final price" variant="standard" InputProps={{
            readOnly: true,
          }} value={PriceAllSeperate.reduce((accumulator, currentValue) => accumulator + currentValue,
            0)} />
        </Grid>

        <Grid item xs={12}>
          <Button onClick={handleOpen}>Add new product</Button>
        </Grid>
      </Grid>

      <Grid container spacing={7} display="flex"
        justifyContent="center"
        alignItems="center">
        <Grid item xs={1}>
          ID
        </Grid>
        <Grid item xs={2}>
          Name
        </Grid>
        <Grid item xs={1}>
          Unit Price
        </Grid>
        <Grid item xs={1}>
          Quantity
        </Grid>
        <Grid item xs={1}>
          Total Price
        </Grid>
        <Grid item xs={3}>
          Delete
        </Grid>
      </Grid>


      {
        allProdObj.map((ids, index) =>
          <>
            <Grid key={ids} container spacing={7} display="flex"
              justifyContent="center"
              alignItems="center">
              <Grid item xs={1}>
                {ids.productID}
              </Grid>
              <Grid item xs={2}>
                {ids.productName}
              </Grid>
              <Grid item xs={1}>
                {ids.price}
              </Grid>
              <Grid item xs={1}>
                {QuantityAllSeperate[index]}
              </Grid>
              <Grid item xs={1}>
                {PriceAllSeperate[index]}
              </Grid>
              <Grid item xs={3}>
                <IconButton aria-label="delete" color="error" onClick={() => delProd(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </>
        )
      }
      <Link to={"/my-orders"}>
        <Button onClick={createOrder}>Create order</Button>
      </Link>
    </>
  )
}

export default OrderPage
