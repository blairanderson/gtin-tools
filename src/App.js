import React from "react";
import "./styles.css";
import gs1 from "gs1";
import bwipjs from "bwip-js";
const FUNCMAP = {
  checkdigit: "Check Digit"
};

export default function App() {
  const [inputValue, setData] = React.useState("3060198697482");
  const [testFunction, changeFunction] = React.useState("checkdigit");

  return (
    <div className="App">
      <h1>Check digit calculator</h1>
      <p>
        The last digit of a barcode number is a computer check digit which makes
        sure the barcode is correctly composed. Use our check digit calculator
        below to calculate a check digit.
      </p>

      <h3>Calculate a check digit</h3>
      <small>GS1 key without check digit</small>
      <br />
      <textarea
        type="text"
        name="upc"
        value={inputValue}
        onChange={(e) => {
          setData(e.target.value);
        }}
      />
      <br />
      <CheckDigit inputValue={inputValue} />
    </div>
  );
}

function CheckDigit(props) {
  const [scale, setScale] = React.useState(5);
  const [height, setHeight] = React.useState(25);
  const inputValue = props.inputValue;
  const output = gs1.checkdigit(inputValue);
  const final = `${inputValue}${gs1.checkdigit(inputValue)}`;
  const valid = gs1.validate(final);
  const [src, setImageSrc] = React.useState(false);
  // Similar to componentDidMount and componentDidUpdate:
  React.useEffect(() => {
    let canvas = document.createElement("canvas");
    if (valid) {
      bwipjs.toCanvas(canvas, {
        bcid: "code128", // Barcode type
        text: final, // Text to encode
        scale: scale, // 3x scaling factor
        height: height, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center" // Always good to set this
      });
      setImageSrc(canvas.toDataURL("image/png"));
    } else {
      setImageSrc(false);
    }
  }, [final, valid, scale, height]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          Check Digit
          <br />
          <input type="number" readOnly value={output} />
        </div>
        <div className="col">
          GTIN-{final.length} <small>(with Check Digit)</small>
          <br />
          <input readOnly value={final} />
        </div>
      </div>

      <div className="row">
        <div className="col text-left">
          Image Scale:{" "}
          <input
            onChange={(e) => {
              setScale(parseInt(e.target.value, 10));
            }}
            style={{ width: "50px" }}
            type="number"
            value={scale}
          />
          <br />
          Height:{" "}
          <input
            onChange={(e) => {
              setHeight(parseInt(e.target.value, 10));
            }}
            style={{ width: "50px" }}
            type="number"
            value={height}
          />
          <br />
          <small>in millimeters</small>
        </div>
        <div className="col">
          {valid && src ? (
            <img src={src} alt={`data matrix from ${final}`} />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
