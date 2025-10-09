import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CIcon from "@coreui/icons-react";
import { cilWarning } from "@coreui/icons";
import { useIncident } from "../context/IncidentContext";
import { toast } from "react-toastify";
import styles from "../assets/css/IncidentForm.module.css";

function IncidentForm() {
  const navigate = useNavigate();
  const { addIncident } = useIncident();

  const fileInputRef = useRef(null); // ✅ ref pour réinitialiser input

  const [form, setForm] = useState({
    client: "",
    produit: "",
    description: "",
    date_survenu: "",
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  // Gestion sélection images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Supprimer image
  const handleRemoveImage = (index) => {
    const newImages = [...form.images];
    const newPreviews = [...previews];

    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setForm({ ...form, images: newImages });
    setPreviews(newPreviews);

    // Réinitialiser input si toutes les images supprimées
    if (newImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Soumettre formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client || !form.produit || !form.description || !form.date_survenu) {
      toast.error("⚠️ Veuillez remplir tous les champs !");
      return;
    }
    addIncident(form);
    toast.success(`✅ Incident déclaré pour ${form.client}!`);

    // Reset formulaire et previews
    setForm({ client: "", produit: "", description: "", date_survenu: "", images: [] });
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Lightbox navigation
  const prevImage = () => setLightboxIndex((prev) => (prev === 0 ? previews.length - 1 : prev - 1));
  const nextImage = () => setLightboxIndex((prev) => (prev === previews.length - 1 ? 0 : prev + 1));
  const toggleZoom = () => setZoomed((prev) => !prev);

  // Nettoyage URLs au démontage
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" style={{ cursor: "pointer" }} onClick={() => navigate("/Accueil")}>
            Accueil
          </li>
          <li className="breadcrumb-item active" aria-current="page">Incident</li>
        </ol>
      </nav>

      <div className={styles.card}>
        <h4 className="mb-3">
          <CIcon icon={cilWarning} className="text-danger me-2" />
          Déclaration d'incident
        </h4>

        <form onSubmit={handleSubmit}>
          {/* Client */}
          <div className="mb-3">
            <label>Client</label>
            <select
              className={styles.input}
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              required
            >
              <option value="">-- Sélectionner un client --</option>
              <option value="bnb">BNB</option>
              <option value="sib">SIB</option>
              <option value="bni">BNI</option>
            </select>
          </div>

          {/* Produit */}
          <div className="mb-3">
            <label>Produit</label>
            <select
              className={styles.input}
              value={form.produit}
              onChange={(e) => setForm({ ...form, produit: e.target.value })}
              required
            >
              <option value="">-- Sélectionner un produit --</option>
              <option value="pointis">Pointis</option>
              <option value="gescred">Gescred</option>
              <option value="activManagement">Activ Management</option>
            </select>
          </div>

          {/* Images */}
          <div className="mb-3">
            <label>Ajouter une ou plusieurs images (optionnel)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.inputFile}
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            {previews.length > 0 && (
              <div className={styles.previewContainer}>
                {previews.map((src, index) => (
                  <div key={index} className={styles.imageWrapper}>
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className={styles.previewImage}
                      onClick={() => setLightboxIndex(index)}
                    />
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className={styles.textarea}
              rows="4"
              placeholder="Décrivez brièvement l'incident..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          {/* Date */}
          <div className="mb-3">
            <label>Date survenue</label>
            <input
              type="date"
              className={styles.input}
              value={form.date_survenu}
              onChange={(e) => setForm({ ...form, date_survenu: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!form.client || !form.produit || !form.description || !form.date_survenu}
          >
            Déclarer
          </button>
        </form>
      </div>

      {/* ✅ Lightbox modal avec bouton fermeture fixe */}
      {lightboxIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setLightboxIndex(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Bouton fermeture fixe */}
            <button
              className={styles.modalCloseFixed}
              onClick={() => setLightboxIndex(null)}
            >
              ✕
            </button>

            <img
              src={previews[lightboxIndex]}
              alt="Aperçu"
              className={`${styles.modalImage} ${zoomed ? styles.zoomed : ""}`}
              onClick={toggleZoom}
            />

            {previews.length > 1 && (
              <>
                <button className={styles.navLeft} onClick={prevImage}>‹</button>
                <button className={styles.navRight} onClick={nextImage}>›</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IncidentForm;
