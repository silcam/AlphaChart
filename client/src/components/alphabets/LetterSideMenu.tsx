import React from "react";
import { AlphabetLetter } from "../../models/Alphabet";
import update from "immutability-helper";
import LnkBtn from "../common/LnkBtn";
import NumberPicker from "../common/NumberPicker";
import { useTranslation } from "../common/useTranslation";
import { ImageStyles } from "../../models/ChartStyles";

interface IProps {
  letter: AlphabetLetter;
  index: number;
  alphabetSize: number;
  close: () => void;
  setLetter: (letter: AlphabetLetter) => void;
  deleteLetter: () => void;
  insertBefore: () => void;
  insertAfter: () => void;
  moveTo: (position: number) => void;
  imageStyles: ImageStyles;
  setImageStyles: (s: ImageStyles) => void;
}

export default function LetterSideMenu(props: IProps) {
  const t = useTranslation();
  const draftForms = [...props.letter.forms, ""];

  const setForm = (index: number, form: string) =>
    props.setLetter(
      update(props.letter, { forms: { [index]: { $set: form } } })
    );

  const clearEmptyForms = () =>
    props.setLetter(
      update(props.letter, {
        forms: { $set: props.letter.forms.filter(f => f.length > 0) }
      })
    );

  return (
    <div className="side-menu letter-side-menu">
      <div style={{ alignSelf: "flex-end" }}>
        <LnkBtn onClick={props.close} text={t("Close")} />
      </div>
      <h1>{props.letter.forms.join("")}</h1>
      <ul style={{ marginBottom: "30px" }}>
        {draftForms.map((form, index) => (
          <li key={index}>
            <input
              type="text"
              value={form}
              onChange={e => setForm(index, e.target.value)}
              onBlur={clearEmptyForms}
              placeholder={t("Add_form")}
              size={8}
              autoFocus={index === 0}
            />
          </li>
        ))}
      </ul>
      <div className="flex-row" style={{ marginBottom: "12px" }}>
        <label>{t("Letter_position")}:</label>
        <NumberPicker
          value={props.index + 1}
          setValue={v => props.moveTo(v - 1)}
          maximum={props.alphabetSize}
          noType
        />
      </div>
      {props.letter.imagePath && (
        <React.Fragment>
          <h4>Image</h4>
          <div className="flex-row" style={{ marginBottom: "12px" }}>
            <label>{t("Size")}:</label>
            <NumberPicker
              value={parseInt(props.imageStyles.width)}
              setValue={v =>
                props.setImageStyles(
                  update(props.imageStyles, { width: { $set: `${v}%` } })
                )
              }
              maximum={100}
              noType
            />
          </div>
          <div className="flex-row" style={{ marginBottom: "12px" }}>
            <label>{t("Image_position")}:</label>
            <NumberPicker
              value={Math.round(
                parseFloat(props.imageStyles.paddingBottom) / 0.125
              )}
              setValue={v =>
                props.setImageStyles(
                  update(props.imageStyles, {
                    paddingBottom: { $set: `${v * 0.125}em` }
                  })
                )
              }
              minimum={0}
              noType
            />
          </div>
        </React.Fragment>
      )}
      <button onClick={props.insertBefore}>
        {t("New_letter_before")}
        <b>{props.letter.forms[0]}</b>
      </button>
      <button onClick={props.insertAfter}>
        {t("New_letter_after")}
        <b>{props.letter.forms[0]}</b>
      </button>
      <button className="red" onClick={props.deleteLetter}>
        {t("Delete_letter")}
        <b>{props.letter.forms[0]}</b>
      </button>
    </div>
  );
}
