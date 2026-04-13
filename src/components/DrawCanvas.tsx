import { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { faEraser, faPen, faRedo, faSave, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons'
import type { UploadResponse } from "@/App";
import { Stack } from "@components/Stack";
import { IconButton } from "@components/IconButton";
import { ColourPicker } from "@components/ColourPicker";
import { addColourToHistory, ColourHistory } from "@components/ColourHistory";
import { Slider } from "@components/Slider";
import { SpinnerOverlay } from "@components/SpinnerOverlay";
import style from '@components/DrawCanvas.module.css';
import { DraggableContainer } from "./DraggableContainer";

type DrawCanvasProps = {
  uploadFile: (file: File) => Promise<UploadResponse>;
};

export const DrawCanvas: React.FC<DrawCanvasProps> = ({ uploadFile }: DrawCanvasProps) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [penColor, setPenColor] = useState("#ffffff");
  const [colourHistory, setColourHistory] = useState<string[]>([]);
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [uploading, setUploading] = useState(false);

  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

  // Weird firefox hotfix
  if (isFirefox){
    window.addEventListener('load', function () {
      var canvas_with_mask = document.querySelector("#react-sketch-canvas__stroke-group-0");
      canvas_with_mask?.removeAttribute("mask");
    })
  }

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };
  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };
  const handlePickColour = (colour: string) => {
    setPenColor(colour);
    setColourHistory((prev) => addColourToHistory(prev, colour));
  };
  const handleUndoClick = () => { canvasRef.current?.undo(); };
  const handleRedoClick = () => { canvasRef.current?.redo(); };
  const handleResetClick = () => { canvasRef.current?.resetCanvas(); };
  const handleUploadClick = async () => {
    setUploading(true);
    const rawSvg = await canvasRef.current?.exportSvg();
    if (!rawSvg) {
      alert("Failed to extract SVG. Please try again.");
      setUploading(false);
      return;
    }
    const fileName = `${Date.now()}.svg`;
    const blob = new Blob([rawSvg], { type: 'image/svg+xml' });
    const file = new File([blob], fileName, { type: 'image/svg+xml' });

    try {
      const response = await uploadFile(file);
      if (!response.ok){
        alert(response.error ?? "Unknown error occured");
      }
      else{
        handleResetClick();
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
    }
    finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    setColourHistory((prev) => addColourToHistory(prev, penColor));
  }, []);

  return (
    <>
      <div className={style.container}>
        <ReactSketchCanvas
          ref={canvasRef}
          className={style.canvas}
          width="100%"
          height="100%"
          canvasColor="transparent"
          strokeColor={penColor}
          strokeWidth={strokeWidth}
          eraserWidth={strokeWidth}
          readOnly={readOnly}
          style={{ touchAction: "none" }} />
      </div>
      <DraggableContainer>
        <Stack gap="1rem">
          <Stack row gap="1rem">
            <IconButton icon={faPen} active={!eraseMode} onClick={handlePenClick} />
            <IconButton icon={faEraser} active={eraseMode} disabled={isFirefox} onClick={handleEraserClick} />
            <ControlSeparator />
            <ColourPicker value={penColor} onChangeComplete={handlePickColour} onOpenChange={(open) => setReadOnly(open)} />
            <ColourHistory colours={colourHistory} onSelect={handlePickColour} />
            <ControlSeparator />
            <IconButton icon={faUndo} onClick={handleUndoClick} />
            <IconButton icon={faRedo} onClick={handleRedoClick} />
            <IconButton icon={faSave} onClick={handleUploadClick} />
            <ControlSeparator />
            <IconButton icon={faTrash} backgroundColor="darkred" onClick={handleResetClick} />
          </Stack>
          <Slider value={strokeWidth} onChange={setStrokeWidth} min={1} max={75} />
        </Stack>
      </DraggableContainer>
      {uploading ? <SpinnerOverlay /> : ''}
    </>
  );
}

const ControlSeparator: React.FC = () => {
  return (
    <div className={style.controlSeparator}></div>
  );
};