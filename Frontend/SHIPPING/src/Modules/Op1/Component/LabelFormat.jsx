import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useStore from '../../../Hooks/useStore';

const LabelFormat = React.forwardRef((props, ref) => {
    const { logo, barcode, qr, originAddress, destinationAddress,  idreceptor, firstname, lastname, phone, size} = useStore();

    return (
        <div className="container" ref={ref} style={{color: 'black'}}>
            <div className="row border border-dark">
            <div className="col-4 border border-dark border-start-0 border-bottom-0 border-top-0 border-end">
                    <img src={logo} alt="" className="img-fluid" style={{ maxHeight: "200px", maxWidth: "100%" }} />
                </div>
                <div className="col-8">
                    <div className="row">
                        <div className="col-4" style={{ fontSize: "12px", paddingTop: "25px" }}>
                            <strong>CUSTOMER</strong>
                            <p>{idreceptor}</p>
                            <p>{firstname + " " + lastname}</p>
                            <p>{phone}</p>
                        </div>
                        <div className="col-4">
                            <div className="row">
                                <div>
                                    <img src={barcode} alt="" height="96px" width="225px"/>
                                </div>
                            </div>
                            <div className="row" style={{ fontSize: "12px" }}>
                                <div className="col-9">
                                    <strong>
                                        Pitney Bowes
                                        ComBasPrice
                                    </strong>
                                </div>
                                <div className="col-3">
                                    <p>
                                        022W0001259214
                                        <br/>
                                        9024324564
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row border border-dark border-top-0" style={{ textAlign: "center" }}>
                <h2>PRIORITY MAIL 3-DAY</h2>
            </div>
            <div className="row border border-dark border-top-0">
                <div className="row">
                    <div className="col-8">
                        <div style={{ marginTop: "0px", fontSize: "12px" }}>
                            <strong>ORIGIN<br/>
                                {originAddress}</strong>
                        </div>
                        <div style={{ marginTop: "90px", fontSize: "16px", paddingLeft: "10px", paddingBottom: "30px" }}>
                            <strong>DESTINATION<br/>
                               {destinationAddress}</strong>
                        </div>
                    </div>
                    <div className="col-4">
                        <p style={{ textAlign: "right", fontSize: "8px" }}>Expresed Delivery Date: 04/26-2020</p>
           
                        <div style={{ fontSize: "25px", marginTop: "40px", textAlign: "right", marginRight: "15px" }}> 
                            <strong>0004</strong>
                        </div>

                        <div style={{ fontSize: "25px", marginTop: "40px", border: "2px solid black", width: "80px", textAlign: "center" }}> 
                            <strong>{size}</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row border border-dark border-top-0">
                <div style={{ backgroundColor: "black", color: "white", textAlign: "center" }}>
                    <h2>TEST LABEL - DO NOT MAIL</h2>
                </div>
            </div>
            <div className="row border border-dark border-top-0 justify-content-center">
                <div style={{ textAlign: "center" }}>
                    <strong>USPS TRACKING #</strong>
                </div>
                <div className="col-5">
                    <img src={qr} alt="" height="150px" />
                </div>
            </div>
            <div className="row border border-dark border-top-0">
                <p>
                    Thank you for shopping with us!
                </p>
            </div>
        </div>
    );
});

export default LabelFormat;
LabelFormat.displayName = 'LabelFormat';
