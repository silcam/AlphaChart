import React from "react";
import { Alphabet, AlphabetLetter } from "../../models/Alphabet";
import { useDropzone } from "react-dropzone";
import Loading from "../common/Loading";
import { ImageStyles } from "../../models/ChartStyles";
import { usePush } from "../../api/apiRequest";
import { pushChartImage } from "./alphabetSlice";
import { useDispatch } from "react-redux";
import bannerSlice from "../../banners/bannerSlice";

interface IProps {
  alphabet: Alphabet;
  setImagePath: (imgPath: string) => void;
  letter: AlphabetLetter;
  imageStyles: ImageStyles;
}

export default function ImageInput(props: IProps) {
  const dispatch = useDispatch();
  const [saveImage, loading] = usePush(pushChartImage, err => {
    if (err.type == "HTTP" && err.status == 413) {
      dispatch(
        bannerSlice.actions.add({
          type: "Error",
          error: { type: "Other", message: "Image_too_big" }
        })
      );
      return true;
    }
    return false;
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const imageFile = acceptedFiles[0];
    const imagePath = await saveImage({
      alphabetId: props.alphabet._id,
      image: imageFile
    });
    if (imagePath) props.setImagePath(imagePath);
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
