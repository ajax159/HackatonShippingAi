

import Box from '@mui/material/Box';
import { Card as MuiCard } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import useStore from '../../Hooks/useStore';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsTransitRoundedIcon from '@mui/icons-material/DirectionsTransitRounded';
import AirplanemodeActiveRoundedIcon from '@mui/icons-material/AirplanemodeActiveRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import { Steps } from 'intro.js-react';

const Card = styled(MuiCard)(({ theme, selected }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  width: 'calc(100% / 3 - 16px)',
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? 'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)'
        : 'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
    borderColor: theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 2px 8px hsla(0, 0%, 0%, 0.1)'
        : '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
  },
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  ...(selected && {
    backgroundColor: theme.palette.action.selected,
    borderColor:
      theme.palette.mode === 'light'
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
  }),
}));

const PaymentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: 375,
  padding: theme.spacing(3),
  borderRadius: '20px',
  border: '1px solid ',
  borderColor: theme.palette.divider,
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.3) 25%, hsla(210, 100%, 90%, 0.3) 100%)'
      : 'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
  boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
  [theme.breakpoints.up('xs')]: {
    height: 300,
  },
  [theme.breakpoints.up('sm')]: {
    height: 300,
  },
}));

const FormGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
// eslint-disable-next-line no-unused-vars, react/prop-types
export default function PaymentForm({Introsteps}) {
  // eslint-disable-next-line no-unused-vars
  const { setCostwadd,distance, setDistance ,rateKm, setRateKm,size, rateKg, setRateKg, additionalCharges, setAdditionalCharges, transportType, setTransportType, km, setKm, kg, setKg, cost, setCost, width, height, length, weight  } = useStore();
  const [introEnabled, setIntroEnabled] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [dimensions, setDimensions] = useState(true);
  const azuremlapi = import.meta.env.VITE_REACT_APP_AZUREML_API;
  const apikey = import.meta.env.VITE_REACT_APP_AZUREML_TOKEN;

  const onExit = () => {
    setIntroEnabled(true);
  };


  const classifyPackage = (size) => {


    if (size == 'XXS') {
      return 1;
    } else if (size == 'XS') {
      return 2;
    } else if (size == 'S') {
      return 3;
    } else if (size == 'M') {
      return 4;
    } else if (size == 'L') {
      return 5;
    } else {
      return 6;
    }
  };



  const handlePaymentTypeChange = (transportType) => {
    const packageSize = classifyPackage(size);
    setDimensions(packageSize);
    if (width == 0 && height == 0 && length == 0) {
      alert('Please set the dimensions before selecting a transport type.');
      return;
    } else{
      setTransportType(transportType);
      try {
        fetch(azuremlapi, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apikey,
          },
          body: JSON.stringify({
            "Inputs": {
              "input1": [
                {
                  "service": transportType,
                  "size": packageSize,
                  "lenght": length,
                  "width": width,
                  "tall": height,
                  "weight": weight,
                  "distance": distance
                }
              ]
            },
            "GlobalParameters": {}
          }),
        })
        .then(response => response.json())
      //   {
      //     "Results": {
      //         "WebServiceOutput0": [
      //             {
      //                 "Scored Labels": 87.96239724592232,
      //                 "distance": 207,
      //                 "lenght": 42,
      //                 "service": 1,
      //                 "size": 2,
      //                 "tall": 26,
      //                 "weight": 17.138,
      //                 "width": 32
      //             }
      //         ]
      //     }
      // }
        .then(data => setCost(Math.floor(data.Results.WebServiceOutput0[0]['Scored Labels'])))
        
        .catch((error) => {
          console.error('Error:', error);
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Stack spacing={{ xs: 1, sm: 6 }} useFlexGap>
      <Steps
        enabled={introEnabled}
        steps={Introsteps}
        initialStep={0}
        onExit={onExit}
      />
      <FormControl component="fieldset" fullWidth id='step-transport'>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          value={transportType}
          onChange={(event) => handlePaymentTypeChange(event.target.value)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          <Card >
            <CardActionArea
              onClick={() => handlePaymentTypeChange(3)}
              sx={{
                '.MuiCardActionArea-focusHighlight': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingIcon
                  fontSize="small"
                  sx={(theme) => ({
                    color: theme.palette.mode === 'light' ? 'grey.400' : 'grey.600',
                    ...(transportType === 2 && {
                      color: 'primary.main',
                    }),
                  })}
                />
                <Typography fontWeight="medium">Road</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card>
            <CardActionArea
              onClick={() => handlePaymentTypeChange(2)}
              sx={{
                '.MuiCardActionArea-focusHighlight': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsTransitRoundedIcon
                  fontSize="small"
                  sx={(theme) => ({
                    color: theme.palette.mode === 'light' ? 'grey.400' : 'grey.600',
                    ...(transportType === 3 && {
                      color: 'primary.main',
                    }),
                  })}
                />
                <Typography fontWeight="medium">Rail</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card>
          <CardActionArea
              onClick={() => handlePaymentTypeChange(1)}
              sx={{
                '.MuiCardActionArea-focusHighlight': {
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AirplanemodeActiveRoundedIcon
                  fontSize="small"
                  sx={(theme) => ({
                    color: theme.palette.mode === 'light' ? 'grey.400' : 'grey.600',
                    ...(transportType === 1 && {
                      color: 'primary.main',
                    }),
                  })}
                />
                <Typography fontWeight="medium">Air</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.8,
          }}
          id='step-transportcost'
        >
          <PaymentContainer >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Transport Cost</Typography>
              <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
            </Box>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaidRoundedIcon
              sx={{
                fontSize: { xs: 48, sm: 56 },
                color: 'text.secondary'
              }}
            />
            <Typography variant="h4">{cost}</Typography>
            </CardContent>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="distance" required>
                  Distance (Km)
                </FormLabel>
                <OutlinedInput
                  id="distance"
                  autoComplete="distance"
                  required
                  value={distance}
                  onChange={(event) => {
                    setDistance(Math.floor(event.target.value));
                  }}
                />
              </FormGrid>
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="Size" required>
                  Size Package
                </FormLabel>
                <OutlinedInput
                  id="Size"
                  autoComplete="Size"
                  required
                  value={size}
                  disabled
                />
              </FormGrid>
            </Box>
          </PaymentContainer>
        </Box>
    </Stack>
  );
}
