import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInterventions } from "../context/InterventionContext";
import { useIncident } from "../context/IncidentContext";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../assets/css/InterventionForm.module.css";
import { toast } from "react-toastify";

function InterventionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addIntervention } = useInterventions();
  const { incidents } = useIncident();

  const incidentFromNav = location.state?.incident;
  const techniciens = ["Nacro", "Youssouf", "Issouf"];
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    client: "",
    produit: "",
    description: "",
    datetime: "",
    technicien: "",
    incidentId: "",
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  // Pré-remplissage depuis navigation
  useEffect(() => {
    if (incidentFromNav) {
      setForm((prev) => ({
        ...prev,
        client: incidentFromNav.client,
        produit: incidentFromNav.produit,
        description: incidentFromNav.description,
        incidentId: incidentFromNav.id,
        images: incidentFromNav.images || [],
      }));
      setPreviews(incidentFromNav.images || []);
    }
  }, [incidentFromNav]);

  // Pré-remplissage lors de sélection d'un incident
  useEffect(() => {
  if (form.incidentId) {
    const selectedIncident = incidents.find(
      (i) => i.id === Number(form.incidentId) && i.statut === "non résolu"
    );
    if (selectedIncident) {
      let previewUrls = [];
      if (selectedIncident.images && selectedIncident.images.length > 0) {
        previewUrls = selectedIncident.images.map(img => {
          // Si c'est déjà une URL string, on la garde
          if (typeof img === "string") return img;
          // Si c'est un File, on crée un URL temporaire
          return URL.createObjectURL(img);
        });
      }

      setForm((prev) => ({
        ...prev,
        client: selectedIncident.client,
        produit: selectedIncident.produit,
        description: selectedIncident.description,
        images: selectedIncident.images || [],
      }));

      setPreviews(previewUrls);
    }
  }
}, [form.incidentId, incidents]);


  // Gestion images multiples
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...form.images];
    const newPreviews = [...previews];

    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setForm({ ...form, images: newImages });
    setPreviews(newPreviews);

    if (newImages.length === 0 && fileInputRef.current) fileInputRef.current.value = "";
  };

  // Soumettre formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client || !form.produit || !form.description || !form.datetime) {
      toast.error("⚠️ Veuillez remplir tous les champs obligatoires !");
      return;
    }

    const newIntervention = {
      id: Date.now(),
      client: form.client,
      produit: form.produit,
      description: form.description,
      datetime: form.datetime,
      technicien: form.technicien,
      incidentId: form.incidentId || null,
      images: form.images,
    };

    addIntervention(newIntervention);
    toast.success("✅ Intervention ajoutée avec succès !");

    // Reset formulaire
    setForm({
      client: "",
      produit: "",
      description: "",
      datetime: "",
      technicien: "",
      incidentId: "",
      images: [],
    });
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const prevImage = () => setLightboxIndex((prev) => (prev === 0 ? previews.length - 1 : prev - 1));
  const nextImage = () => setLightboxIndex((prev) => (prev === previews.length - 1 ? 0 : prev + 1));
  const toggleZoom = () => setZoomed((prev) => !prev);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" style={{ cursor: "pointer" }} onClick={() => navigate("/Accueil")}>Accueil</li>
          <li className="breadcrumb-item active" aria-current="page">Intervention</li>
        </ol>
      </nav>

      <div className={styles.card}>
        <h4 className="mb-3">Ajouter une intervention</h4>

        <form onSubmit={handleSubmit}>
          {/* Incident associé */}
          <div className="mb-3">
            <label>Incident associé (facultatif)</label>
            <select
              className={styles.input}
              value={form.incidentId || ""}
              onChange={(e) => setForm({ ...form, incidentId: e.target.value })}
            >
              <option value="">-- Sélectionner un incident non résolu --</option>
              {incidents.filter(i => i.statut === "non résolu").map(i => (
                <option key={i.id} value={i.id}>#{i.id} - {i.client} - {i.produit}</option>
              ))}
            </select>
          </div>

          {/* Client & Produit */}
          <div className="mb-3">
            <label>Client</label>
            <input type="text" className={styles.input} value={form.client} onChange={e => setForm({...form, client: e.target.value})} required readOnly={!!form.incidentId}/>
          </div>
          <div className="mb-3">
            <label>Produit</label>
            <input type="text" className={styles.input} value={form.produit} onChange={e => setForm({...form, produit: e.target.value})} required readOnly={!!form.incidentId}/>
          </div>

          {/* Upload images */}
          <div className="mb-3">
            <label>Ajouter une ou plusieurs images (optionnel)</label>
            <input type="file" accept="image/*" multiple className={styles.inputFile} onChange={handleImageChange} ref={fileInputRef}/>
            {previews.length > 0 && (
              <div className={styles.previewContainer}>
                {previews.map((src, idx) => (
                  <div key={idx} className={styles.imageWrapper}>
                    <img src={src} alt={`Preview ${idx}`} className={styles.previewImage} onClick={() => setLightboxIndex(idx)} />
                    <button type="button" className={styles.removeImageBtn} onClick={() => handleRemoveImage(idx)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label>Description</label>
            <textarea className={styles.textarea} rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required readOnly={!!form.incidentId}/>
          </div>

          <h5>Planification</h5>
          <div className="mb-3">
            <label>Date et heure</label>
            <input type="datetime-local" className={styles.input} value={form.datetime} onChange={e => setForm({...form, datetime: e.target.value})} required/>
          </div>
          <div className="mb-3">
            <label>Technicien</label>
            <select className={styles.input} value={form.technicien} onChange={e => setForm({...form, technicien: e.target.value})}>
              <option value="">-- Sélectionner un technicien --</option>
              {techniciens.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
            </select>
          </div>

          <button type="submit" className={styles.submitBtn}>Ajouter & Planifier</button>
        </form>
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setLightboxIndex(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalCloseFixed} onClick={() => setLightboxIndex(null)}>✕</button>
            <img src={previews[lightboxIndex]} alt="Aperçu" className={`${styles.modalImage} ${zoomed ? styles.zoomed : ""}`} onClick={toggleZoom}/>
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

export default InterventionForm;
