import React, { Fragment, useState } from 'react';
import classes from './UpdateCompany.module.css';
import { useHistory } from 'react-router-dom';
import Card from '../../LoginComponents/Card/Card';
import { CompanyType } from '../../ClientTypes/Models/CompanyModel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Stack } from "@mui/material";

type Props = {
  token: string
  company?: CompanyType
  onConfirm?: () => void
  updateCompany: (dataForUpdate) => void
}

const UpdateCompany: React.FC<Props> = (props) => {

  const nameEditing = props.company.name;
  const [emailEditing, setEmailEditing] = useState<string>(props.company.email);
  const [finished, setFinished] = useState<boolean>(false);
  const [passwordState, setPasswordState] = useState({ val: props.company.password, isValid: true });
  const history = useHistory();


  const passwordChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordState({
      val: event.target.value,
      isValid: event.target.value.trim().length > 6
    })
  }

  const dataForUpdate = {
    name: nameEditing,
    email: emailEditing,
    password: passwordState.val, }

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dataToSend = {
      id: props.company.id,
      name: nameEditing,
      email: emailEditing,
      password: passwordState.val,
    }

    props.updateCompany(dataForUpdate);

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: { "Content-Type": "application/json", "token": props.token },
      body: JSON.stringify(dataToSend)
    };
    let response
    try {
      response = await fetch("http://localhost:8080/adminApi/updateCompany", requestOptions);
    }
    catch (e) {
      history.push('/PageNotFound')
    }
    if (!response.ok) {
      if (await response.text() === "Service is not found")
        history.push('/login')
      else {
        history.push('/PageNotFound')
      }
    }
    setFinished(true);
  }

  const content: JSX.Element | JSX.Element[] =
    <>
      <div className={classes.backdrop} onClick={props.onConfirm} />
      <Card className={classes.modal} >
        <header className={classes.header}>
          <h2>Update Company</h2>
        </header>
        <form onSubmit={submitHandler} >
          <Typography variant="h6" component="div" align="center" sx={{ my: 2, mx: 2, flexGrow: 1, fontWeight: "bold", }}>
          </Typography>
          <Stack
            direction="column"
            justifyContent="center"
            spacing={2}
            alignItems="center">
            <Grid sx={{ my: 3, fontWeight: "bold" }}>
              <TextField sx={{ mx: 3, fontWeight: "bold" }}
                disabled
                label="Name"
                variant="outlined"
                value={nameEditing}
              />
            </Grid>
            <Grid sx={{ my: 2, fontWeight: "bold" }}>
              <TextField sx={{ mx: 3, fontWeight: "bold" }}
                label="Email"
                variant="outlined"
                value={emailEditing}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmailEditing(event.target.value)}
              />
            </Grid>
            <Grid sx={{ my: 3, fontWeight: "bold" }}>
              <TextField sx={{ mt: 3, mb: 5, mx: 3, fontWeight: "bold" }}
                label="Password"
                variant="outlined"
                error={!passwordState.isValid}
                value={passwordState.val}
                onChange={passwordChangeHandler}
              />
            </Grid>
          </Stack>
          <footer className={classes.actions}>
            <Button type='submit' variant="contained" sx={{ mx: 3, }} disabled={passwordState.isValid ? false : true}>
              Update Company
            </Button>
            <Button onClick={props.onConfirm} type="button" variant="contained" >
              Cancel
            </Button>
          </footer>
        </form>
      </Card>
    </>
  return (
    <Fragment>
      {!finished && content}
      {finished &&
        <>
          <div className={classes.backdrop} onClick={props.onConfirm} />
          <Card className={classes.modal} >
            <div className={classes.content}></div>
            <Grid item sx={{ ml: 9, mt: 5, mb: 3 }}>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "1.6em" }}
              >The Company was Updated Successfully</Typography>
            </Grid>
            <footer className={classes.actions}>
              <Button onClick={props.onConfirm}>Okay</Button>
            </footer>
          </Card>
        </>
      }
    </Fragment>
  );
};

export default UpdateCompany;


