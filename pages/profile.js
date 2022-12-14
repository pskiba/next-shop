import { History, Person } from "@mui/icons-material";
import {
  Button,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";

function Profile(props) {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const userInfoStorage = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    if (!userInfoStorage) {
      return router.push("/login");
    }
    setValue("name", userInfoStorage.name);
    setValue("email", userInfoStorage.email);
  }, []);

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Password don't match", { variant: "error" });
      return;
    }
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "USER_LOGIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title="User Profile" props={props}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={{ mt: "10px" }}>
            <NextLink href="/profile" passHref>
              <ListItemButton selected>
                <ListItemIcon sx={{ color: "warning.main" }}>
                  <Person />
                </ListItemIcon>
                <ListItemText sx={{ color: "warning.main" }}>
                  User Profile
                </ListItemText>
              </ListItemButton>
            </NextLink>
            <Divider />
            <NextLink href="/order-history" passHref>
              <ListItemButton>
                <ListItemIcon>
                  <History />
                </ListItemIcon>
                <ListItemText>Order History</ListItemText>
              </ListItemButton>
            </NextLink>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card sx={{ mt: "10px" }}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  User Profile
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    width: "100%",
                  }}
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <TextField
                            color="success"
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name
                                ? errors.name.type === "minLength"
                                  ? "Name length is more than 1"
                                  : "Name is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        }}
                        render={({ field }) => (
                          <TextField
                            color="success"
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            inputProps={{ type: "email" }}
                            error={Boolean(errors.email)}
                            helperText={
                              errors.email
                                ? errors.email.type === "pattern"
                                  ? "Email is not valid"
                                  : "Email is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === "" ||
                            value.length > 5 ||
                            "Password length is more than 5",
                        }}
                        render={({ field }) => (
                          <TextField
                            color="success"
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            inputProps={{ type: "password" }}
                            error={Boolean(errors.password)}
                            helperText={
                              errors.password
                                ? "Password length is more than 5"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === "" ||
                            value.length > 5 ||
                            "Confirm Password length is more than 5",
                        }}
                        render={({ field }) => (
                          <TextField
                            color="success"
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            inputProps={{ type: "password" }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.confirmPassword
                                ? "Confirm Password length is more than 5"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="outlined"
                        type="submit"
                        fullWidth
                        color="success"
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
