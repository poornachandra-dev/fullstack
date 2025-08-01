import React, { useContext, useEffect } from 'react';
import './ImageView.css';
import { StoreContext } from '../../context/storeContext';
import axios from 'axios';
import { ArrowDownToLine, Heart, X } from 'lucide-react';

const ImageView = () => {
  const { shownImageData, setShownImageData, imageShow, setImageShow, url } = useContext(StoreContext);

  // const handleThumbnailClick = (image, clickedIndex) => {
  //   if (!shownImageData?.surroundingImages) return;

  //   const totalImages = shownImageData.surroundingImages.length;
  //   let newSurroundingImages = [...shownImageData.surroundingImages];

  //   // Reorganize the images to create a circular chain around the clicked image
  //   const reorganizedImages = [];
  //   for (let i = 0; i < totalImages; i++) {
  //     // Calculate the new position relative to clicked image
  //     const newIndex = (clickedIndex + i) % totalImages;
  //     reorganizedImages.push(newSurroundingImages[newIndex]);
  //   }

  //   setShownImageData({
  //     currentImage: image,
  //     surroundingImages: reorganizedImages,
  //     currentIndex: 0 // Clicked image becomes the first in the array
  //   });
  // };

  // const handleThumbnailClick = (image, clickedIndex) => {
  //   if (!shownImageData?.surroundingImages) return;

  //   const totalImages = shownImageData.surroundingImages.length;

  //   // Reorganize the array to make the clicked image the center
  //   const reorderedImages = shownImageData.surroundingImages
  //     .slice(clickedIndex)
  //     .concat(shownImageData.surroundingImages.slice(0, clickedIndex));

  //   setShownImageData({
  //     currentImage: image, // Set clicked image as the current one
  //     surroundingImages: reorderedImages, // Update surrounding images
  //     currentIndex: 0, // Reset the index to 0 for the clicked image
  //   });
  // };


  const getDownloadUrl = (url) => {
    const cloudinaryBase = "res.cloudinary.com";
    if (url?.includes(cloudinaryBase)) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  };

  const handleLike = async (mediaId, currentLikeStatus) => {
    // Optimistic UI update
    setShownImageData(prev => ({
      ...prev,
      currentImage: {
        ...prev.currentImage,
        isLiked: !currentLikeStatus,
      },
      // surroundingImages: prev.surroundingImages.map(img =>
      //   img._id === mediaId ? { ...img, isLiked: !currentLikeStatus } : img
      // ),
    }));

    try {
      await axios.post(
        `${url}/api/like`,
        { mediaId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error liking image:", error.response || error.message);

      // Revert UI update on failure
      setShownImageData(prev => ({
        ...prev,
        currentImage: {
          ...prev.currentImage,
          isLiked: currentLikeStatus,
        },
        surroundingImages: prev.surroundingImages.map(img =>
          img._id === imageId ? { ...img, isLiked: currentLikeStatus } : img
        ),
      }));
    }
  };

  // If there's no data or the viewer isn't shown, don't render anything
  if (!imageShow || !shownImageData?.currentImage) return null;

  const { currentImage, surroundingImages = [], currentIndex } = shownImageData;

  // Calculate visible thumbnails (show 5 before and 5 after)
  // const getVisibleThumbnails = () => {
  //   if (!surroundingImages.length) return [];

  //   const totalImages = surroundingImages.length;
  //   const visibleCount = Math.min(10, totalImages - 1); // Show up to 10 thumbnails
  //   const thumbnails = [];

  //   for (let i = 0; i < totalImages; i++) {
  //     const relativePosition = (i - currentIndex + totalImages) % totalImages; // Handle circular indexing
  //     thumbnails.push({
  //       image: surroundingImages[i],
  //       index: i,
  //       position: relativePosition,
  //     });
  //   }

  //   return thumbnails;
  // };

  return (
    <div className={`view_wrapper ${imageShow ? 'active' : ''}`}>
      <div className="view_nav">
        <div className="left_nav">
          <span>
            <div className="img_holder">
              {currentImage.uploader?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3>{currentImage.uploader || 'Unknown'}</h3>
          </span>
        </div>
        <div className="right_nav">

          {currentImage.displayType != "ai-image" && (
            <>
              <span
                className="like-button"
                onClick={() => handleLike(currentImage._id, currentImage.isLiked)}
                title="Like Image"
              >
                <Heart
                  size={20}
                  strokeWidth={1.75}
                  color={currentImage.isLiked ? "#FF0000" : "black"}
                  fill={currentImage.isLiked ? "#FF0000" : "none"}
                  style={{ cursor: "pointer" }}
                  aria-label={currentImage.isLiked ? "Unlike" : "Like"}
                />
              </span>

              <a
                href={getDownloadUrl(currentImage.url)}
                download
                className="download-button"
              >
                <span><ArrowDownToLine size={20} strokeWidth={1.75} /><span className='tooltip'>Download</span></span>
              </a>
            </>

          )}
          {currentImage.aigen_picture_url && (
            <a
              href={currentImage.aigen_picture_url}
              download
              className="download-button"
            >
              <span><ArrowDownToLine size={20} strokeWidth={1.75} /><span className='tooltip'>Download</span></span>
            </a>
          )}
          <span onClick={() => setImageShow(false)}>
            <X size={20} strokeWidth={2.5} />
          </span>
        </div>
      </div>

      <div className="view_image">
        {(currentImage.url && currentImage.type === 'video') ? <video src={currentImage.url} controls autoPlay></video> : <img src={currentImage.url || currentImage.aigen_picture_url} alt="" />}
      </div>

      {/* <div className="view_image_list">
        <div className="thumbnail-container">
          {getVisibleThumbnails().map(({ image, index, position }) => (
            <span
              key={index}
              onClick={() => handleThumbnailClick(image, index)}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              style={{
                "--position": position, // Add position dynamically
              }}
            >
              {image?.url && <img src={image.url} alt="" />}
            </span>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ImageView;