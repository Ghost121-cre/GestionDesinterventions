import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CIcon from "@coreui/icons-react";
import { 
  cilWarning, 
  cilUser, 
  cilDescription, 
  cilImage, 
  cilCalendar,
  cilPlus,
  cilX,
  cilChevronLeft,
  cilChevronRight,
  cilZoom,
  cilCheckCircle
} from "@coreui/icons";
import { useIncident } from "../context/IncidentContext";
import { toast } from "react-toastify";
import styles from "../assets/css/IncidentForm.module.css";

function IncidentForm() {
  const navigate = useNavigate();
  const { addIncident } = useIncident();

  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    client: "",
    produit: "",
    description: "",
    date_survenu: "",
    images: [],
    priorite: "medium"
  });

  const [previews, setPreviews] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  // Options pour les sélecteurs
  const clients = [
    { value: "bnb", label: "BNB", color: "#2563eb" },
    { value: "sib", label: "SIB", color: "#10b981" },
    { value: "bni", label: "BNI", color: "#f59e0b" }
  ];

  const produits = [
    { value: "pointis", label: "Pointis", icon: "🖥️" },
    { value: "gescred", label: "Gescred", icon: "💳" },
    { value: "activManagement", label: "Activ Management", icon: "⚙️" }
  ];

  // Gestion sélection images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Vérifier la limite d'images
    if (files.length + form.images.length > 10) {
      toast.error("❌ Maximum 10 images autorisées");
      return;
    }

    // Vérifier la taille des fichiers
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024); // 5MB
    if (oversizedFiles.length > 0) {
      toast.error("❌ Certains fichiers dépassent 5MB");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
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
  };

  // Soumettre formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.client || !form.produit || !form.description || !form.date_survenu) {
      toast.error("⚠️ Veuillez remplir tous les champs obligatoires !");
      return;
    }

    setIsSubmitting(true);

    try {
      await addIncident({
        ...form,
        statut: "non résolu",
        createdAt: new Date().toISOString()
      });
      
      toast.success(`✅ Incident déclaré pour ${form.client} !`);

      // Reset formulaire
      setForm({ 
        client: "", 
        produit: "", 
        description: "", 
        date_survenu: "", 
        images: [],
        priorite: "medium"
      });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);

      // Redirection après succès
      setTimeout(() => navigate("/incidents"), 1500);
      
    } catch (error) {
      toast.error("❌ Erreur lors de la déclaration de l'incident");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lightbox navigation
  const prevImage = () => setLightboxIndex((prev) => (prev === 0 ? previews.length - 1 : prev - 1));
  const nextImage = () => setLightboxIndex((prev) => (prev === previews.length - 1 ? 0 : prev + 1));
  const toggleZoom = () => setZoomed((prev) => !prev);

  // Nettoyage URLs au démontage
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "low": return "#10b981";
      case "medium": return "#f59e0b";
      case "high": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getSelectedClient = () => clients.find(c => c.value === form.client);
  const getSelectedProduit = () => produits.find(p => p.value === form.produit);

  return (
    <div className={styles.container}>
      {/* Breadcrumb amélioré */}
      <nav aria-label="breadcrumb" className={styles.breadcrumb}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item" onClick={() => navigate("/Accueil")}>
            <CIcon icon={cilChevronLeft} className={styles.breadcrumbIcon} />
            Accueil
          </li>
          <li className="breadcrumb-item active">Déclaration d'Incident</li>
        </ol>
      </nav>

      <div className={styles.card}>
        {/* En-tête */}
        <div className={styles.header}>
          <h4 className={styles.title}>
            <CIcon icon={cilWarning} className={styles.titleIcon} />
            Déclaration d'Incident
          </h4>
          <p className={styles.subtitle}>
            Signalez un problème technique pour une intervention rapide
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Client et Produit */}
          <div className="row">
            <div className="col-md-6">
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <CIcon icon={cilUser} className={styles.labelIcon} />
                  Client *
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    required
                  >
                    <option value="">-- Sélectionner un client --</option>
                    {clients.map(client => (
                      <option key={client.value} value={client.value}>
                        {client.label}
                      </option>
                    ))}
                  </select>
                  {form.client && (
                    <div 
                      className={styles.selectedBadge}
                      style={{ backgroundColor: getSelectedClient()?.color }}
                    >
                      {getSelectedClient()?.label}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles.formGroup}>
                <label className={styles.label}>Produit *</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={form.produit}
                    onChange={(e) => setForm({ ...form, produit: e.target.value })}
                    required
                  >
                    <option value="">-- Sélectionner un produit --</option>
                    {produits.map(produit => (
                      <option key={produit.value} value={produit.value}>
                        {produit.icon} {produit.label}
                      </option>
                    ))}
                  </select>
                  {form.produit && (
                    <div className={styles.selectedBadge}>
                      {getSelectedProduit()?.icon} {getSelectedProduit()?.label}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Priorité */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Niveau de Priorité</label>
            <div className={styles.priorityGroup}>
              {[
                { value: "low", label: "Basse", color: "#10b981", description: "Problème mineur" },
                { value: "medium", label: "Moyenne", color: "#f59e0b", description: "Impact modéré" },
                { value: "high", label: "Haute", color: "#ef4444", description: "Urgence critique" }
              ].map(priority => (
                <label key={priority.value} className={styles.priorityOption}>
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={form.priorite === priority.value}
                    onChange={(e) => setForm({...form, priorite: e.target.value})}
                    className={styles.priorityInput}
                  />
                  <span 
                    className={styles.priorityCard}
                    style={{ 
                      borderColor: form.priorite === priority.value ? priority.color : '#e5e7eb',
                      backgroundColor: form.priorite === priority.value ? `${priority.color}15` : 'transparent'
                    }}
                  >
                    <span 
                      className={styles.priorityIndicator}
                      style={{ backgroundColor: priority.color }}
                    ></span>
                    <div className={styles.priorityContent}>
                      <span className={styles.priorityLabel}>{priority.label}</span>
                      <span className={styles.priorityDescription}>{priority.description}</span>
                    </div>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload images */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <CIcon icon={cilImage} className={styles.labelIcon} />
              Images du problème (max. 10)
            </label>
            
            {/* Indicateur du nombre d'images */}
            {previews.length > 0 && (
              <div className={styles.imageCounter}>
                {previews.length} image(s) sélectionnée(s)
              </div>
            )}
            
            <div 
              className={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              <CIcon icon={cilImage} size="2xl" className={styles.uploadIcon} />
              <p className={styles.uploadText}>
                {previews.length > 0 ? 'Ajouter plus d\'images' : 'Cliquer pour ajouter des images'}
              </p>
              <small className={styles.uploadHint}>
                PNG, JPG, JPEG jusqu'à 5MB par fichier
              </small>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className={styles.hiddenFileInput} 
                onChange={handleImageChange} 
                ref={fileInputRef}
              />
            </div>
            
            {previews.length > 0 && (
              <div className={styles.previewSection}>
                <div className={styles.previewContainer}>
                  {previews.map((src, index) => (
                    <div key={index} className={styles.imageWrapper}>
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className={styles.previewImage}
                        onClick={() => setLightboxIndex(index)}
                      />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        title="Supprimer cette image"
                      >
                        <CIcon icon={cilX} />
                      </button>
                      <div className={styles.imageNumber}>{index + 1}</div>
                    </div>
                  ))}
                </div>
                
                {/* Bouton pour supprimer toutes les images */}
                {previews.length > 1 && (
                  <button
                    type="button"
                    className={styles.clearAllBtn}
                    onClick={() => {
                      previews.forEach((url) => URL.revokeObjectURL(url));
                      setPreviews([]);
                      setForm({ ...form, images: [] });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <CIcon icon={cilX} />
                    Supprimer toutes les images
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <CIcon icon={cilDescription} className={styles.labelIcon} />
              Description détaillée *
            </label>
            <textarea
              className={styles.textarea}
              rows="5"
              placeholder="Décrivez précisément le problème rencontré, les erreurs affichées, et les étapes pour reproduire l'incident..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              maxLength="500"
            />
            <div className={styles.charCount}>
              {form.description.length} / 500 caractères
            </div>
          </div>

          {/* Date */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <CIcon icon={cilCalendar} className={styles.labelIcon} />
              Date de survenue *
            </label>
            <input
              type="date"
              className={styles.input}
              value={form.date_survenu}
              onChange={(e) => setForm({ ...form, date_survenu: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Récapitulatif */}
          {(form.client || form.produit || form.priorite !== "medium") && (
            <div className={styles.summary}>
              <h6 className={styles.summaryTitle}>Récapitulatif</h6>
              <div className={styles.summaryGrid}>
                {form.client && (
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Client:</span>
                    <span className={styles.summaryValue}>{getSelectedClient()?.label}</span>
                  </div>
                )}
                {form.produit && (
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Produit:</span>
                    <span className={styles.summaryValue}>
                      {getSelectedProduit()?.icon} {getSelectedProduit()?.label}
                    </span>
                  </div>
                )}
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Priorité:</span>
                  <span 
                    className={styles.summaryValue}
                    style={{ color: getPriorityColor(form.priorite) }}
                  >
                    {form.priorite === 'low' ? 'Basse' : form.priorite === 'medium' ? 'Moyenne' : 'Haute'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelBtn}
              onClick={() => navigate("/Accueil")}
            >
              <CIcon icon={cilChevronLeft} className={styles.btnIcon} />
              Annuler
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting || !form.client || !form.produit || !form.description || !form.date_survenu}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Déclaration...
                </>
              ) : (
                <>
                  <CIcon icon={cilCheckCircle} className={styles.btnIcon} />
                  Déclarer l'incident
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox modal amélioré */}
      {lightboxIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setLightboxIndex(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalClose}
              onClick={() => setLightboxIndex(null)}
              title="Fermer"
            >
              <CIcon icon={cilX} />
            </button>

            <div className={styles.modalImageContainer}>
              <img
                src={previews[lightboxIndex]}
                alt="Aperçu"
                className={`${styles.modalImage} ${zoomed ? styles.zoomed : ""}`}
                onClick={toggleZoom}
              />
              <button 
                className={styles.zoomHint}
                onClick={toggleZoom}
              >
                <CIcon icon={cilZoom} />
                {zoomed ? 'Dézoomer' : 'Zoomer'}
              </button>
            </div>

            {previews.length > 1 && (
              <>
                <button className={styles.navBtn} onClick={prevImage} title="Image précédente">
                  <CIcon icon={cilChevronLeft} />
                </button>
                <button className={styles.navBtn} onClick={nextImage} title="Image suivante">
                  <CIcon icon={cilChevronRight} />
                </button>
                <div className={styles.imageCounter}>
                  {lightboxIndex + 1} / {previews.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IncidentForm;