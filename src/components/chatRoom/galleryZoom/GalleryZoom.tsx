import Modal from "@/components/modal/Modal";
import "./styles.scss";
import { Carousel } from "@/components";
type Props = {
  imgs: string[];
  onClose: () => void;
};
export default function GalleryZoom({ imgs, onClose }: Props) {
  return (
    <Modal className="gallery-modal" onClose={onClose}>
      <Carousel className="gallery-container">
        {imgs.map((url, i) => (
          <img src={url} key={i} className="zoomed-img" />
        ))}
      </Carousel>
    </Modal>
  );
}
