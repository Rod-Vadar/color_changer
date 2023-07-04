import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";

function ColorChange() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const canvasRef = useRef(null);
  const [originalImageData, setOriginalImageData] = useState([]);
  const [newImageData, setNewImageData] = useState([]);
  const [redValue, setRedValue] = useState(0);
  const [greenValue, setGreenValue] = useState(0);
  const [blueValue, setBlueValue] = useState(0);
  const [length, setLength] = useState(0);

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    setIsImageLoaded(true);
    if (file.type.startsWith("image/")) {
      const image = new Image();
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const imageURL = URL.createObjectURL(file);
      image.src = imageURL;

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        // free resources of imageURL
        URL.revokeObjectURL(imageURL);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const pixelData = new Uint8ClampedArray(imageData.data);
        setOriginalImageData(pixelData);
        setNewImageData(new Uint8ClampedArray(pixelData));
        setLength(pixelData.length);
      };
    }
  };
  //fixed
  const applyFilter = () => {
    for (let i = 0; i < length; i += 4) {
      newImageData[i + 0] = Math.min(originalImageData[i + 0] + redValue, 255);
      newImageData[i + 1] = Math.min(
        originalImageData[i + 1] + greenValue,
        255
      );
      newImageData[i + 2] = Math.min(originalImageData[i + 2] + blueValue, 255);
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.putImageData(
      new ImageData(newImageData, canvas.width, canvas.height),
      0,
      0
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRedChange = (event) => {
    if (isImageLoaded) {
      setRedValue(Number(event.target.value));
      applyFilter();
    }
  };

  const handleGreenChange = (event) => {
    if (isImageLoaded) {
      setGreenValue(Number(event.target.value));
      applyFilter();
    }
  };

  const handleBlueChange = (event) => {
    if (isImageLoaded) {
      setBlueValue(Number(event.target.value));
      applyFilter();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "filtered_image.png";
    link.click();
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          maxWidth: "720px",
          maxHeight: "480px",
          border: "1px solid black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>
      <h6>Simply drag and drop any image into the canvas</h6>

      <Form>
        <Form.Group controlId="redSlider">
          <Form.Label>Red</Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="255"
            value={redValue}
            onChange={handleRedChange}
            style={{
              background: "black",
              // background: `linear-gradient(to right, rgb(${redValue}, 0, 0), rgb(${redValue}, 0, 0))`,
            }}
          />
        </Form.Group>
        <Form.Group controlId="greenSlider">
          <Form.Label>Green</Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="255"
            value={greenValue}
            onChange={handleGreenChange}
            style={{
              background: "black",
              // background: `linear-gradient(to right, rgb(0, ${greenValue}, 0), rgb(0, ${greenValue}, 0))`,
            }}
          />
        </Form.Group>
        <Form.Group controlId="blueSlider">
          <Form.Label>Blue</Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="255"
            value={blueValue}
            onChange={handleBlueChange}
            style={{
              background: "black",
              // background: `linear-gradient(to right, rgb(0, 0, ${blueValue}), rgb(0, 0, ${blueValue}))`,
            }}
          />
        </Form.Group>
        <Button className="mt-3" variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Form>
    </div>
  );
}

export default ColorChange;
