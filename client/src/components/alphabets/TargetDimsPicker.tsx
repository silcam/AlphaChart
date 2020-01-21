import React from "react";
import {
  PageDims,
  PaperSizes,
  PaperSize,
  UnitsOfLength,
  UnitOfLength,
  dpiOptions,
  usingPx
} from "./PageDims";
import Select from "../common/Select";
import update from "immutability-helper";
import NumberTextInput from "../common/NumberTextInput";
import { useTranslation } from "../common/useTranslation";
import { nonStrictT } from "../../i18n/i18n";

interface IProps {
  value: PageDims;
  setValue: (p: PageDims) => void;
}

export default function TargetDimsPicker(props: IProps) {
  const t = useTranslation();
  const flexT = nonStrictT(t);
  const pageDims = props.value;

  const updateDims = (mergePageDims: Partial<PageDims>) => {
    props.setValue(update(props.value, { $merge: mergePageDims }));
  };

  return (
    <div className="space-kids compTargetDimsPicker">
      <div>
        <label>{t("Paper_size")} </label>
        <Select
          value={pageDims.paperSize}
          options={PaperSizes.map(ps => [ps, flexT(ps)])}
          setValue={paperSize =>
            updateDims({ paperSize: paperSize as PaperSize })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={pageDims.landscape}
            onChange={e => updateDims({ landscape: e.target.checked })}
          />
          {t("Landscape")}
        </label>
      </div>
      {pageDims.paperSize === "Custom" && (
        <div className="customDims">
          <label>{t("Custom_size")} </label>
          <label>
            {`${t("Width")} : `}
            <NumberTextInput
              initialValue={pageDims.customSize[0]}
              setValue={val =>
                updateDims({ customSize: [val, pageDims.customSize[1]] })
              }
            />
          </label>
          <label>
            {`${t("Height")} : `}
            <NumberTextInput
              initialValue={pageDims.customSize[1]}
              setValue={val =>
                updateDims({ customSize: [pageDims.customSize[0], val] })
              }
            />
          </label>
          <label>
            {`${t("Units")} : `}
            <Select
              value={pageDims.customUnits}
              options={UnitsOfLength.map(unit => [unit, unit])}
              setValue={val => updateDims({ customUnits: val as UnitOfLength })}
            />
          </label>
        </div>
      )}
      {!usingPx(pageDims) && (
        <div>
          <label>{t("DPI")} </label>
          <Select
            value={`${pageDims.dpi}`}
            options={dpiOptions().map(dpi => [`${dpi}`, `${dpi}`])}
            setValue={dpi => updateDims({ dpi: parseInt(dpi) })}
          />
        </div>
      )}
    </div>
  );
}
