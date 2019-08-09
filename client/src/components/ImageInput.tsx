import React from "react";
import { Alphabet, AlphabetLetter } from "../alphabet/Alphabet";
import { useDropzone } from "react-dropzone";
import Axios from "axios";

interface IProps {
  alphabet: Alphabet;
  setImagePath: (imgPath: string) => void;
  letter: AlphabetLetter;
}

export default function ImageInput(props: IProps) {
  const onDrop = (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append("image", acceptedFiles[0]);
    Axios.post(`/api/alphabets/${props.alphabet._id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(response => {
      props.setImagePath(response.data.path);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="drop-zone drop-zone-active">Drop here</p>
      ) : !!props.letter.imagePath ? (
        <img src={props.letter.imagePath} alt={props.letter.exampleWord} />
      ) : (
        <p className="drop-zone">Add image</p>
      )}
    </div>
  );
}
