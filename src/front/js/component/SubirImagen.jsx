import React, { useState } from 'react';

const SubirImagen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("img", selectedFile);

      const response = await fetch("https://reimagined-space-waddle-7qw7pvr4p743rg7j-3001.app.github.dev/img", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.img_url);
        alert("Imagen subida con exito", data.img_url);
        alert("Subida exitosa");
      } else {
        throw new Error(`Error en la subida de la imagen: ${response.status} ${response.statusText}`);
      }
    } else {
      alert('Por favor, selecciona un archivo antes de subir.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 display-6 text-center">Subir imagen con Cloudinary</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">Subir imagen</button>
      </form>
      {uploadError && <p className="text-danger">{uploadError}</p>}
      {imageUrl && <img src={imageUrl} alt="Imagen subida" className="mt-3" />}
    </div>
  );
};

export default SubirImagen;