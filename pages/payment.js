import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import CheckoutWizzard from "../components/CheckoutWizzard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

function Payment(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { dispatch } = useContext(Store);

  useEffect(() => {
    const userInfoStorage = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    dispatch({ type: "USER_LOGIN", payload: userInfoStorage });
    const shippingAddressStorage = localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : null;
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: shippingAddressStorage,
    });
    if (!shippingAddressStorage || !shippingAddressStorage.address) {
      router.push("/shipping");
    } else {
      const paymentMethodStorage = localStorage.getItem("paymentMethod")
        ? JSON.parse(localStorage.getItem("paymentMethod"))
        : null;
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodStorage });
      setPaymentMethod(paymentMethodStorage);
    }
    const cartItemsStorage = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    dispatch({ type: "SAVE_CART_ITEMS", payload: cartItemsStorage });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    closeSnackbar();
    if (!paymentMethod) {
      enqueueSnackbar("Payment method is required", { variant: "error" });
    } else {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
      localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
      router.push("/placeorder");
    }
  };

  return (
    <Layout title="Payment Method" props={props}>
      <CheckoutWizzard activeStep={2} />
      <form
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%",
        }}
        onSubmit={submitHandler}
      >
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio color="success" />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio color="success" />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio color="success" />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="outlined" color="success">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color="grey"
              fullWidth
              variant="outlined"
              onClick={() => router.push("/shipping")}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Payment), { ssr: false });
