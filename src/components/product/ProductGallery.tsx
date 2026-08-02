import { useState } from 'react';

interface ProductGalleryProps {
  productName: string;
  mainImage: string;
  thumbnails: string[];
}

export default function ProductGallery({ productName, mainImage, thumbnails }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(mainImage);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  const selectThumbnail = (idx: number) => {
    setSelectedThumbnail(idx);
    setActiveImage(thumbnails[idx]);
  };

  return (
    <div>
      <div className="rp-gallery-main">
        <img src={activeImage} alt={productName} />
      </div>
      <div className="rp-thumbs">
        {thumbnails.map((thumb, idx) => (
          <button type="button" key={thumb} className={`rp-thumb ${selectedThumbnail === idx ? 'active' : ''}`} onClick={() => selectThumbnail(idx)}>
            <img src={thumb} alt={`thumb-${idx}`} />
          </button>
        ))}
        <div className="rp-thumb"><div className="rp-card-body">+12</div></div>
      </div>
    </div>
  );
}
