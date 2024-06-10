import { useState, useRef } from 'react';
import { Fragment } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from './AddressForm';
import Info from './Info';
import InfoMobile from './InfoMobile';
import PaymentForm from './PaymentForm';
import Review from './Review';

import ShippingDetails from './ShippingDetails';
import LabelFormat from './Component/LabelFormat';
import { useReactToPrint } from 'react-to-print';
import { Steps } from 'intro.js-react';




function ToggleCustomTheme() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        aria-label="Toggle design language"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
      </ToggleButtonGroup>
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.bool.isRequired
};

const steps = ['Customer information','Shipping details', 'Transport details', 'Review your order'];

function getStepContent(step, refs, introSteps, shippingSteps, transportDetailsSteps, revierOrderSteps) {
  switch (step) {
    case 0:
      return <AddressForm ref={refs.addressFormRef} Introsteps={introSteps}/>;
    case 1:
      return <ShippingDetails ref={refs.shippingDetailsRef} Introsteps={shippingSteps}/>;
    case 2:
      return <PaymentForm Introsteps={transportDetailsSteps}/>;
    case 3:
      return <Review Introsteps={revierOrderSteps}/>;
    default:
      throw new Error('Unknown step');
  }
}


export default function Checkout() {
  const [mode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = useState(0);
  const addressFormRef = useRef();
  const shippingDetailsRef = useRef();
  const [introEnabled, setIntroEnabled] = useState(true);

  const introSteps = [
    {
      title: 'Welcome to Shipping AI',
      element: '#step-1',
      intro: 'Iniciemos por escanear nuestro paquete',
    },
    {
      title: 'Start scanning',
      element: '#step-2',
      intro: 'Click en el botón de Start para iniciar el escaneo',
    },
    {
      title: 'Revies the package',
      element: '#step-py',
      intro: 'Arrange the package until it matches the three yellow corners',
    },
    {
      title: 'Calculate Dimensions',
      element: '#step-4',
      intro: 'Click en el botón de Calculate Dimensions para obtener las dimensiones del paquete',
    },
    {
      title: 'Stop scanning',
      element: '#step-3',
      intro: 'Click en el botón de Stop para detener el escaneo',
    },
    {
      title: 'Review Package Details',
      element: '#step-5',
      intro: 'Ahora que tienes el ancho, alto y largo de tu paquete, por favor llena el peso aproximado de tu paquete',
    },
    {
      title: 'Weight details',
      element: '#step-6',
      intro: 'Please fill out all required fields in the Weight Details step',
    },
    {
      title: 'Customer information',
      element: '#step-7',
      intro: 'Please fill out all required fields in the Customer Information step',
    },
    {
      title: 'Click Next',
      element: '#step-next',
      intro: 'Please review the information before clicking Next',
    },
  ];

  const shippingSteps = [
    {
      title: 'Origin',
      element: '#step-origin',
      intro: 'Please fill out all required fields in the Originstep',
    },
    {
      title: 'Destination',
      element: '#step-destination',
      intro: 'Please fill out all required fields in the Destination step',
    },
    {
      title: 'Review route',
      element: '#step-map',
      intro: 'Please review the route before clicking Next',
    },
    {
      title: 'Click Next',
      element: '#step-next',
      intro: 'Please review the information before clicking Next',
    },
  ]

  const transportDetailsSteps = [
    {
      title: 'Transport',
      element: '#step-transport',
      intro: 'Please select the transport type',
    },
    {
      title: 'Transport Cost',
      element: '#step-transportcost',
      intro: 'Please review the transport cost before clicking Next',
    },
    {
      title: 'Click Next',
      element: '#step-next',
      intro: 'Please review the information before clicking Next',
    },
  ]

  const revierOrderSteps = [
    {
      title: 'Review your order',
      element: '#step-review',
      intro: 'Please review the order before clicking Next',
    },
    {
      title: 'Click Next',
      element: '#step-next',
      intro: 'Please review the information before clicking Next',
    },
  ]

  const onExit = () => {
    setIntroEnabled(false);
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
      content: () => componentRef.current,
  });



  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };
  

  const handleNext = () => {
    if (activeStep === 0 && addressFormRef.current && !addressFormRef.current.isValid()) {
      alert("Please fill out all required fields.");
      return;
    }
    if (activeStep === 1 && shippingDetailsRef.current && !shippingDetailsRef.current.isValid()) {
      alert('Please fill out all required fields in the Shipping Details step.');
      return;
    }

    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Steps
        enabled={introEnabled}
        steps={introSteps}
        initialStep={0}
        onExit={onExit}
      />
      <CssBaseline />
      <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
    <Grid
      item
      sm={4}
      sx={{
        backgroundColor: 'rgba(19, 27, 32, 1)',
        borderRight: { sm: 'none', md: '1px solid' },
        borderColor: { sm: 'none', md: 'divider' },
        display: 'flex',
        justifyContent: 'center',
        overflow: 'auto'
      }}
    >
      <Box
        sx={{
          padding: 2,
          position: 'fixed',
        }}
      >
        <Info Introsteps={introSteps}/>
      </Box>
    </Grid>
    <Grid
      item
      md={8}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'rgb(9, 14, 16)',
        alignItems: 'start',
        pt: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 10 },
        gap: { xs: 4, md: 8 },
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: { md: 'flex-end' },
          alignItems: 'center',
          height: 'auto',
          width: '100%',
        }}
      >

        <Box
          sx={{
            display: { md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1,
            width: '100%',
          }}
        >
          <Stepper
            id="desktop-stepper"
            activeStep={activeStep}
            sx={{
              height: 40,
              width: '100%',
            }}
          >
            {steps.map((label) => (
              <Step
              
                key={label}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
      <Card
        sx={{
          display: { xs: 'flex', md: 'none' },
          width: '100%',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            ':last-child': { pb: 2 },
          }}
        >
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Selected products
            </Typography>
            <Typography variant="body1">
              {activeStep >= 2 ? '$144.97' : '$134.98'}
            </Typography>
          </div>
          <InfoMobile totalPrice={activeStep >= 2 ? '$144.97' : '$134.98'} />
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100%',
          maxWidth: { sm: '100%', md: '100%' },
          maxHeight: '720px',
          gap: { xs: 5, md: 'none' },
        }}
      >
        <Stepper
          id="mobile-stepper"
          activeStep={activeStep}
          alternativeLabel
          sx={{ display: { sm: 'flex', md: 'none' } }}
        >
          {steps.map((label) => (
            <Step
              sx={{
                ':first-child': { pl: 0 },
                ':last-child': { pr: 0 },
                '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
              }}
              key={label}
            >
              <StepLabel
                sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <Stack spacing={2} useFlexGap >
            <Typography variant="h1">📦</Typography>
            <Typography variant="h5">Thank you for your order!</Typography>
            <Typography variant="body1" color="text.secondary">
              This system was made with ❤️ by Shipping AI team.
            </Typography> 
            <Button
                variant="contained"
                sx={{
                  alignSelf: 'start',
                  width: { xs: '100%', sm: 'auto' },
                }}
                onClick={handlePrint}
              >
                Print Label
              </Button>
              <div style={{ display: 'none' }}>
                <LabelFormat ref={componentRef} />
            </div>
          </Stack>
        ) : (
          <Fragment>
            {getStepContent(activeStep, { addressFormRef, shippingDetailsRef }, introSteps, shippingSteps, transportDetailsSteps, revierOrderSteps)}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexGrow: 1,
                gap: 1,
                pb: { xs: 12, sm: 0 },
                mt: { xs: 2, sm: 0 },
                mb: '200px'
              }}
            >
              {activeStep !== 0 && (
                <Button
                  startIcon={<ChevronLeftRoundedIcon />}
                  onClick={handleBack}
                  variant="text"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                  }}
                >
                  Previous
                </Button>
              )}

              {activeStep !== 0 && (
                <Button
                  startIcon={<ChevronLeftRoundedIcon />}
                  onClick={handleBack}
                  variant="outlined"
                  fullWidth
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                  }}
                >
                  Previous
                </Button>
              )}

              <Button
                variant="contained"
                endIcon={<ChevronRightRoundedIcon />}
                onClick={handleNext}
                id='step-next'
                sx={{
                  width: { xs: '100%', sm: 'fit-content' },
                }}
              >
                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
              </Button>
            </Box>
          </Fragment>
        )}
      </Box>
    </Grid>
  </Grid>
      <ToggleCustomTheme
        toggleCustomTheme={toggleCustomTheme}
        showCustomTheme={showCustomTheme}
      />
    </ThemeProvider>
  );
}
