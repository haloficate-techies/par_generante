import React, { useId } from "react";
import PropTypes from "prop-types";
import BrandAssetSelector from "../ui/BrandAssetSelector";
import BannerBackgroundPreview from "../ui/BannerBackgroundPreview";
import LeagueLogoSelector from "../ui/LeagueLogoSelector";

const BannerMetadataSection = ({
  showTitleField = false,
  title = "",
  onTitleChange,
  brandLogoSrc = "",
  footerSrc = "",
  onBrandLogoChange,
  brandOptions = [],
  backgroundSrc = "",
  showLeagueLogoInput = false,
  leagueLogoSrc = "",
  onLeagueLogoChange,
  leagueLogoOptions = [],
}) => {
  const titleInputId = useId();
  return (
    <section className="grid gap-4">
      {showTitleField && (
        <div className="flex flex-col">
          <label
            htmlFor={titleInputId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Judul Banner
          </label>
          <input
            id={titleInputId}
            type="text"
            value={title}
            onChange={(event) => onTitleChange?.(event.target.value.toUpperCase())}
            placeholder="Masukkan judul liga / kompetisinya"
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-slate-100 uppercase tracking-wide focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
        </div>
      )}
      <BrandAssetSelector
        label="Brand & Banner Footer"
        helperText="Pilih brand untuk menampilkan logo header dan banner footer secara otomatis."
        selectedHeaderSrc={brandLogoSrc}
        footerPreviewSrc={footerSrc}
        onChange={onBrandLogoChange}
        options={brandOptions}
      />
      {showLeagueLogoInput ? (
        <LeagueLogoSelector
          value={leagueLogoSrc}
          onChange={onLeagueLogoChange}
          options={leagueLogoOptions}
        />
      ) : null}
      <BannerBackgroundPreview src={backgroundSrc} />
    </section>
  );
};

const optionShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

BannerMetadataSection.propTypes = {
  showTitleField: PropTypes.bool,
  title: PropTypes.string,
  onTitleChange: PropTypes.func,
  brandLogoSrc: PropTypes.string,
  footerSrc: PropTypes.string,
  onBrandLogoChange: PropTypes.func,
  brandOptions: PropTypes.arrayOf(optionShape),
  backgroundSrc: PropTypes.string,
  showLeagueLogoInput: PropTypes.bool,
  leagueLogoSrc: PropTypes.string,
  onLeagueLogoChange: PropTypes.func,
  leagueLogoOptions: PropTypes.arrayOf(optionShape),
};

export default BannerMetadataSection;

