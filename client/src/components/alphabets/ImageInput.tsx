import React, { useState, useContext } from "react";
import { Alphabet, AlphabetLetter } from "../../models/Alphabet";
import { useDropzone } from "react-dropzone";
import Axios from "axios";
import Loading from "../common/Loading";
import ErrorContext from "../common/ErrorContext";

interface IProps {
  alphabet: Alphabet;
  setImagePath: (imgPath: string) => void;
  letter: AlphabetLetter;
}

export default function ImageInput(props: IProps) {
  const [uploading, setUploading] = useState(false);
  const { setErrorMessage } = useContext(ErrorContext);

  const onDrop = (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append("image", acceptedFiles[0]);
    setUploading(true);
    Axios.post(`/api/alphabets/${props.alphabet._id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(response => {
        setUploading(false);
        props.setImagePath(response.data.path);
      })
      .catch(err => {
        setUploading(false);
        if (err.response) {
          if (err.response.status === 413)
            setErrorMessage("That image is too big.");
          else
            setErrorMessage(
              `The was a problem with that image. (Code ${err.response.status})`
            );
        } else {
          setErrorMessage("Unable to upload image.");
        }
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dropZoneLabel = props.letter.imagePath ? "Change image" : "Add Image";

  if (uploading) {
    return (
      <div>
        <p className="drop-zone">
          <Loading />
        </p>
      </div>
    );
  }

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
