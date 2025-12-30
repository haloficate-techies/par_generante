import React from "react";
import PropTypes from "prop-types";

const BannerBackgroundPreview = ({ src = "" }) => (
  <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-200">
          Background Banner
        </p>
        <p className="text-xs text-slate-400">
          Background mengikuti brand. Kosongkan brand untuk memakai default.
        </p>
      </div>
    </div>
    <div className="mt-4 flex h-48 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-600 bg-slate-800/40 md:h-56">
      {src ? (
        <img
          src={src}
          alt="Background banner preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm text-slate-400">Background tidak tersedia</span>
      )}
    </div>
  </div>
);

BannerBackgroundPreview.propTypes = {
  src: PropTypes.string,
};

export default BannerBackgroundPreview;
