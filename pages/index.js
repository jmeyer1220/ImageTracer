import React, { useState, useCallback, useEffect } from "react";
import Button from "../components/ui/button";
import Slider from "../components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import potrace from "potrace";
import { saveAs } from "file-saver";

const ImageTraceApp = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [svgOutput, setSvgOutput] = useState(null);
  const [threshold, setThreshold] = useState(128);
  const [color, setColor] = useState(false);
  const [alphaMax, setAlphaMax] = useState(1);
  const [turnPolicy, setTurnPolicy] = useState("black");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const traceImage = useCallback(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      potrace.trace(
        imageData,
        { threshold, color, alphaMax, turnPolicy },
        (err, svg) => {
          if (err) console.error(err);
          else setSvgOutput(svg);
        },
      );
    };
    img.src = imageUrl;
  }, [imageUrl, threshold, color, alphaMax, turnPolicy]);

  useEffect(() => {
    traceImage();
  }, [threshold, color, alphaMax, turnPolicy, traceImage]);

  const downloadSvg = () => {
    if (svgOutput) {
      const blob = new Blob([svgOutput], {
        type: "image/svg+xml;charset=utf-8",
      });
      saveAs(blob, "traced_image.svg");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Image Trace App</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4 w-full p-2 border rounded"
          />
          <div className="mb-4">
            <label className="block mb-2">Threshold: {threshold}</label>
            <Slider
              value={[threshold]}
              onValueChange={(value) => setThreshold(value[0])}
              min={0}
              max={255}
              step={1}
              className="mb-4"
            />
            <label className="block mb-2">Alpha Max: {alphaMax}</label>
            <Slider
              value={[alphaMax]}
              onValueChange={(value) => setAlphaMax(value[0])}
              min={0}
              max={1}
              step={0.1}
              className="mb-4"
            />
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={color}
                  onChange={(e) => setColor(e.target.checked)}
                  className="mr-2"
                />
                Color
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Turn Policy:</label>
              <select
                value={turnPolicy}
                onChange={(e) => setTurnPolicy(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="minority">Minority</option>
                <option value="majority">Majority</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 grid grid-cols-2">
        {imageUrl && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Original Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={imageUrl} alt="Original" className="w-full h-auto" />
            </CardContent>
          </Card>
        )}

        {svgOutput && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Traced SVG</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                dangerouslySetInnerHTML={{ __html: svgOutput }}
                className="w-full h-auto"
              />
              <Button onClick={downloadSvg} className="mt-4">
                Download SVG
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImageTraceApp;
