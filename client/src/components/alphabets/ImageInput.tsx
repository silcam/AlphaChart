import React from "react";
import { Alphabet, AlphabetLetter } from "../../models/Alphabet";
import { useDropzone } from "react-dropzone";
import Loading from "../common/Loading";
import useNetwork from "../common/useNetwork";
import { apiPath } from "../../models/Api";
import { ImageStyles } from "../../models/ChartStyles";

interface IProps {
  alphabet: Alphabet;
  setImagePath: (imgPath: string) => void;
  letter: AlphabetLetter;
  imageStyles: ImageStyles;
}

export default function ImageInput(props: IProps) {
  const [loading, request] = useNetwork();

  const onDrop = (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append("image", acceptedFiles[0]);
    request(
      axios =>
        axios.post(
          apiPath(`/alphabets/${props.alphabet._id}/images`),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        ),
      { 413: "That image is too big." }
    )
      .then(response => {
        response && props.setImagePath(response.data.path);
      })
      .catch(err => console.error(err));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dropZoneLabel = props.letter.imagePath ? "Change image" : "Add Image";

  if (loading) {
    return (
      <div>
        <div className="drop-zone">
          <Loading />
        </div>
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
                style={props.imageStyles}
              />
            )}
            <p className="drop-zone">{dropZoneLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
