import React from "react";
import PropTypes from "prop-types";

const ImageAdjustmentControls = ({
  scale,
  offsetX,
  offsetY,
  onScaleChange,
  onOffsetChange,
}) => (
  <div className="mt-4 grid gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Skala Logo ({Math.round((scale ?? 1) * 100)}%)
      </label>
      <input
        type="range"
        min="0.7"
        max="1.5"
        step="0.01"
        value={scale ?? 1}
        onChange={onScaleChange}
        className="w-full accent-brand-yellow"
      />
    </div>
    <div className="grid gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Offset Logo
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="range"
          min="-0.75"
          max="0.75"
          step="0.01"
          value={offsetX ?? 0}
          onChange={(event) => onOffsetChange(event, "offsetX")}
          className="w-full accent-brand-yellow"
        />
        <input
          type="range"
          min="-0.75"
          max="0.75"
          step="0.01"
          value={offsetY ?? 0}
          onChange={(event) => onOffsetChange(event, "offsetY")}
          className="w-full accent-brand-yellow"
        />
      </div>
    </div>
  </div>
);

ImageAdjustmentControls.propTypes = {
  scale: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  onScaleChange: PropTypes.func.isRequired,
  onOffsetChange: PropTypes.func.isRequired,
};

export default ImageAdjustmentControls;

