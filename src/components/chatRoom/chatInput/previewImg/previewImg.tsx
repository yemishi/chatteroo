import "./styles.scss";
import RemoveIcon from "@/assets/icons/close.svg?react";
import Carousel from "@/components/carousel/Carousel";
type Props = {
  imgs: string[];
  removeImg: (i: number, url?: string) => void;
};
export default function PreviewImg({ imgs, removeImg }: Props) {
  if (!imgs.length) return null;

  return (
    <Carousel className="preview-img">
      {imgs.map((url, i) => (
        <div key={i} className="preview-img__item">
          <img src={url} alt="image preview" className="preview-img__pic" />
          <button onClick={() => removeImg(i, url)} className="preview-img__remove-btn">
            <RemoveIcon />
          </button>
        </div>
      ))}
    </Carousel>
  );
}
