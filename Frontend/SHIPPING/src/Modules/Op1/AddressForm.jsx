
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useState, forwardRef, useImperativeHandle } from 'react';
import useStore from '../../Hooks/useStore';
import { Steps } from 'intro.js-react';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));


// eslint-disable-next-line react/prop-types
const AddressForm = forwardRef(({Introsteps}, ref) => {
  const { idreceptor,setIdReceptor, setFirstname, setLastname, setPhone } = useStore();
  const [name, setName] = useState('');
  const [lname, setLname] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [introEnabled, setIntroEnabled] = useState(true);
  const api = import.meta.env.VITE_REACT_APP_RANDOPERSONAPI_URL;


  useImperativeHandle(ref, () => ({
    isValid() {
      return idreceptor && name && lname && cellphone;
    }
  }));

  const onExit = () => {
    setIntroEnabled(true);
  };


  const getData = () => {
    fetch(api).then(response => response.json()).then(data => {
      setFirstname(data.results[0].name.first);
      setName(data.results[0].name.first);
      setLastname(data.results[0].name.last);
      setLname(data.results[0].name.last);
      setPhone(data.results[0].phone);
      setCellphone(data.results[0].phone);

    })
  }

  return (
    <Grid container spacing={3} id='step-7'>
      <Steps
        enabled={introEnabled}
        steps={Introsteps}
        initialStep={0}
        onExit={onExit}
      />
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="sender-id" required>
          Customer ID
        </FormLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <OutlinedInput
          id="sender-id"
          name="sender-id"
          type="text"
          placeholder="000000000"
          autoComplete="first name"
          value={idreceptor}
          onChange={(e) => setIdReceptor(e.target.value)}
          required
          sx={{ flexGrow: 1 }}
        />
        <Button variant="outlined" onClick={getData} sx={{ height: '56px' }}>Get Data</Button>
      </Box>
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="first-name"
          name="first-name"
          type="name"
          placeholder="John"
          autoComplete="first name"
          value={name}
          onChange={(event) => (setName(event.target.value), setFirstname(event.target.value))}
          required
        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Last name
        </FormLabel>
        <OutlinedInput
          id="last-name"
          name="last-name"
          type="last-name"
          placeholder="Snow"
          autoComplete="last name"
          value={lname}
          onChange={(event) => (setLname(event.target.value), setLastname(event.target.value))}
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="phone" required>
          Phone
        </FormLabel>
        <OutlinedInput
          id="phone"
          name="phone"
          type="phone"
          placeholder="New York"
          autoComplete="phone"
          value={cellphone}
          onChange={(event) => (setCellphone(event.target.value), setPhone(event.target.value))}
          required
        />
      </FormGrid>
    </Grid>
  );
})
AddressForm.displayName = 'AddressForm';
export default AddressForm;