import * as React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useStore from '../../Hooks/useStore';
import { Steps } from 'intro.js-react';


// eslint-disable-next-line react/prop-types
export default function Review({Introsteps}) {
  const {length, width, height, weight, duration, distance, cost, originAddress, destinationAddress, idreceptor, firstname, lastname, phone} = useStore();
  
  const [estimation, setEstimation] = React.useState();
  const [introEnabled, setIntroEnabled] = React.useState(true);

  const onExit = () => {
    setIntroEnabled(true);
  };
  
  React.useEffect(() => {
    if(duration){
      const hours = Math.floor(duration / 60);
      const minutes = Math.floor(duration % 60);
      setEstimation(hours + 'h ' + minutes + 'm');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setEstimation]);

  return (
    <Stack spacing={2} id='step-review'>
      <Steps
        enabled={introEnabled}
        steps={Introsteps}
        initialStep={0}
        onExit={onExit}
      />
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${cost}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Customer details
          </Typography>
          <Typography gutterBottom>ID</Typography>
          <Typography color="text.secondary" gutterBottom>
            {idreceptor}
          </Typography>
          <Typography gutterBottom>Name</Typography>
          <Typography color="text.secondary" gutterBottom>
            {firstname + ' ' + lastname}
          </Typography>
          <Typography gutterBottom>Phone</Typography>
          <Typography color="text.secondary" gutterBottom>
            {phone}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          <Typography gutterBottom>Origin</Typography>
          <Typography color="text.secondary" gutterBottom>
            {originAddress}
          </Typography>
          <Typography gutterBottom>Destination</Typography>
          <Typography color="text.secondary" gutterBottom>
            {destinationAddress}
          </Typography>
          <Typography gutterBottom>Distance</Typography>
          <Typography color="text.secondary" gutterBottom>
            {distance}Km
          </Typography>
          <Typography gutterBottom>Time Estimation</Typography>
          <Typography color="text.secondary" gutterBottom>
            {estimation}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Package details
          </Typography>
          <Typography gutterBottom>Dimensions</Typography>
          <Typography color="text.secondary" gutterBottom>
            {length}x{width}x{height}cm
          </Typography>
          <Typography gutterBottom>Weight</Typography>
          <Typography color="text.secondary" gutterBottom>
            {weight}Kg
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}
