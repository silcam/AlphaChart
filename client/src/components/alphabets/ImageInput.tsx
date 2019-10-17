import React from "react";
import { Alphabet, AlphabetLetter } from "../../models/Alphabet";
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

  const dropZoneLabel = props.letter.imagePath ? "Change image" : "Add Image";

  return (
    <div onClick={e => e.stopPropagation()}>
      <div {...getRootProps()} className="drop-zone-root">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="drop-zone drop-zone-active">Drop here</p>
        ) : (
          <div
            className="edit-alpha-image"
            data-image-set={!!props.letter.imagePath}
          >
            {!!props.letter.imagePath && (
              <img
                src={encodeURI(props.letter.imagePath)}
                alt={props.letter.exampleWord}
              />
            )}
            <p className="drop-zone">{dropZoneLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
