import React from "react";
import PropTypes from "prop-types";

const Tooltip = ({
  content,
  align = "center",
  side = "bottom",
  className = "",
  children,
}) => {
  const sideClass = side === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const alignClass =
    align === "left"
      ? "left-0"
      : align === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";
  const arrowAlignClass =
    align === "left"
      ? "left-3"
      : align === "right"
        ? "right-3"
        : "left-1/2 -translate-x-1/2";
  const arrowSideClass = side === "top" ? "-bottom-1" : "-top-1";

  return (
    <span className={`group/tooltip relative inline-flex items-center ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-20 w-max max-w-[80vw] rounded-lg border border-slate-700 bg-slate-950/95 px-3 py-2 text-xs text-slate-200 opacity-0 shadow-xl backdrop-blur transition-opacity delay-100 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 ${sideClass} ${alignClass}`}
      >
        <span
          className={`absolute h-2 w-2 rotate-45 border-l border-t border-slate-700 bg-slate-950/95 ${arrowSideClass} ${arrowAlignClass}`}
        />
        {content}
      </span>
    </span>
  );
};

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "center", "right"]),
  side: PropTypes.oneOf(["top", "bottom"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
