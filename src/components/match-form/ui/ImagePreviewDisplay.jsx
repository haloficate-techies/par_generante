import React from "react";
import PropTypes from "prop-types";

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

const ImagePreviewDisplay = ({
  previewSrc,
  label,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  isFlipped = false,
  slotHeight = "h-32",
}) => {
  const clampedScale = clampValue(scale ?? 1, 0.7, 1.5);
  const clampedOffsetX = clampValue(offsetX ?? 0, -0.75, 0.75);
  const clampedOffsetY = clampValue(offsetY ?? 0, -0.75, 0.75);
  const previewOffsetX = isFlipped ? -clampedOffsetX : clampedOffsetX;

  const transformStyle = {
    transform: `translate(${previewOffsetX * 50}%, ${clampedOffsetY * 50}%) scale(${clampedScale})`,
  };
  const mirrorWrapperStyle = isFlipped ? { transform: "scaleX(-1)" } : undefined;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900/60 ${slotHeight}`}
    >
      <div className="absolute inset-0 flex items-center justify-center" style={transformStyle}>
        <div style={mirrorWrapperStyle} className="h-full w-full">
          {previewSrc ? (
            <img src={previewSrc} alt={label} className="h-full w-full object-contain" />
          ) : (
            <span className="text-sm text-slate-500">Belum ada gambar</span>
          )}
        </div>
      </div>
    </div>
  );
};

ImagePreviewDisplay.propTypes = {
  previewSrc: PropTypes.string,
  label: PropTypes.string,
  scale: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  isFlipped: PropTypes.bool,
  slotHeight: PropTypes.string,
};

export default ImagePreviewDisplay;

