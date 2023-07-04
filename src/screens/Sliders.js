import React, { useRef, useEffect, useState } from "react";

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = imageRef.current;

    if (imageLoaded) {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
    }
  }, [imageLoaded]);

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRedChange = (event) => {
    applyFilter("red", event.target.value);
  };

  const handleGreenChange = (event) => {
    applyFilter("green", event.target.value);
  };

  const handleBlueChange = (event) => {
    applyFilter("blue", event.target.value);
  };

  const applyFilter = (channel, value) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = imageRef.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (channel === "red") {
        data[i] = Math.min(value, 255);
      } else if (channel === "green") {
        data[i + 1] = Math.min(value, 255);
      } else if (channel === "blue") {
        data[i + 2] = Math.min(value, 255);
      }
    }

    context.putImageData(imageData, 0, 0);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        width: "400px",
        height: "400px",
        border: "2px dashed gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas ref={canvasRef}></canvas>
      <input
        type="file"
        accept="image/*"
        onChange={handleDrop}
        style={{ display: "none" }}
      />
      <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
        Drag and drop or click here to upload an image.
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleDrop}
        style={{ display: "none" }}
      />
      {imageLoaded && (
        <div>
          <div>
            <label htmlFor="red">Red:</label>
            <input
              type="range"
              id="red"
              min="0"
              max="255"
              onChange={handleRedChange}
            />
          </div>
          <div>
            <label htmlFor="green">Green:</label>
            <input
              type="range"
              id="green"
              min="0"
              max="255"
              onChange={handleGreenChange}
            />
          </div>
          <div>
            <label htmlFor="blue">Blue:</label>
            <input
              type="range"
              id="blue"
              min="0"
              max="255"
              onChange={handleBlueChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
