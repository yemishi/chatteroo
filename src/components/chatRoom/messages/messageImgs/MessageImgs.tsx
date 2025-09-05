import "./styles.scss";

type Props = {
  imgs: string[];
  zoomImgs: (imgs: string[]) => void;
  hasText: boolean;
};
export default function MessageImgs({ imgs, hasText, zoomImgs }: Props) {
  if (!imgs.length) return;
  return imgs.length === 1 ? (
    <div
      onClick={() => zoomImgs(imgs)}
      className={`message-content__img message-content__img--single  ${
        hasText ? "message-content__img--with-text" : ""
      }`}
    >
      <img src={imgs[0]} alt="sent image" />
    </div>
  ) : (
    <div
      onClick={() => zoomImgs(imgs)}
      className={`message-content__img ${
        imgs.length === 1 ? "message-content__img--single" : "message-content__img--multi"
      } ${hasText ? "message-content__img--with-text" : ""} ${imgs.length > 2 ? "rows-2" : ""} ${
        imgs.length === 3 ? "rows-2--fill-last" : ""
      }`}
    >
      {imgs.slice(0, 4).map((url, i) => {
        if (i === 3 && imgs.length - 4 > 0) {
          return (
            <div key={i} className="image-overlay">
              <img src={url} alt={`sent image ${i + 1}`} />
              <div className="overlay-text">+{imgs.length - 4}</div>
            </div>
          );
        }
        return <img key={i} src={url} alt={`sent image ${i + 1}`} />;
      })}
    </div>
  );
}
