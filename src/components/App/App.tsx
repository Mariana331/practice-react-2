import Section from "../Section/Section";
import Container from "../Container/Container";
import { useState } from "react";
import type { Photo } from "../../types/photo";
import Form from "../Form/Form";
import { getPhotos } from "../../services/photos";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isError, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSelectedPhoto = (photo: Photo | null) => {
    setSelectedPhoto(photo);
  };

  const handleSubmit = async (query: string) => {
    try {
      setIsLoading(true);
      setError(false);
      setPhotos([]);
      const fetchedPhotos = await getPhotos(query);
      if (!fetchedPhotos.length) {
        toast.error("No photos found for your email");
        return;
      }
      setPhotos(fetchedPhotos);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSubmit} />
          {isLoading && <Loader />}
          {isError && <Text textAlign="center">Something 🤷‍♀️ wrong ... </Text>}
          {photos.length > 0 && (
            <PhotosGallery photos={photos} onSelect={handleSelectedPhoto} />
          )}
          {selectedPhoto && (
            <Modal
              onClose={() => {
                setSelectedPhoto(null);
              }}
            >
              <div
                style={{
                  backgroundColor: selectedPhoto.avg_color,
                  borderColor: selectedPhoto.avg_color,
                }}
              >
                <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
              </div>
            </Modal>
          )}
        </Container>
      </Section>
      <Toaster />
    </>
  );
}
