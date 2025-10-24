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
import { incidentService, dataService } from "../services/apiService";
import { toast } from "react-toastify";
import styles from "../assets/css/IncidentForm.module.css";

function IncidentForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // États pour les données des select
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);

  const [form, setForm] = useState({
    clientId: "",
    produitId: "",
    description: "",
    date_survenu: "",
    images: [],
    priorite: ""
  });

  const [previews, setPreviews] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  // Charger les données au montage du composant
  useEffect(() => {
    loadSelectData();
  }, []);

  const loadSelectData = async () => {
    try {
      setLoading(true);
      const [clientsData, produitsData] = await Promise.all([
        dataService.getClients(),
        dataService.getProduits()
      ]);
      
      setClients(clientsData);
      setProduits(produitsData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Gestion sélection images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + form.images.length > 10) {
      toast.error("❌ Maximum 10 images autorisées");
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("❌ Certains fichiers dépassent 5MB");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Fonction pour supprimer une image
  const handleRemoveImage = (index) => {
    const newImages = [...form.images];
    const newPreviews = [...previews];
    
    // Révoquer l'URL de l'image preview
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setForm({ ...form, images: newImages });
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.clientId || !form.produitId || !form.description || !form.date_survenu) {
      toast.error("⚠️ Veuillez remplir tous les champs obligatoires !");
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer les données pour l'API (sans les images pour l'instant)
      const incidentData = {
        clientId: parseInt(form.clientId),
        produitId: parseInt(form.produitId),
        description: form.description,
        priorite: form.priorite,
        statut: "non résolu",
        dateSurvenu: new Date(form.date_survenu).toISOString(),
        images: [] // On envoie un tableau vide pour l'instant
      };

      console.log('📤 Création incident avec données:', incidentData);
      
      // 1. Créer l'incident d'abord
      const newIncident = await incidentService.createIncident(incidentData);
      console.log('✅ Incident créé:', newIncident);
      
      // 2. Uploader les images si elles existent
      if (form.images.length > 0) {
        console.log('📸 Upload des images...');
        await uploadImages(newIncident.id, form.images);
      }
      
      toast.success(`✅ Incident déclaré avec succès !`);

      // Reset formulaire
      setForm({ 
        clientId: "", 
        produitId: "", 
        description: "", 
        date_survenu: "", 
        images: [],
        priorite: "medium"
      });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);

      setTimeout(() => navigate("/incidents"), 1500);
      
    } catch (error) {
      console.error('💥 Erreur:', error);
      toast.error("❌ Erreur lors de la déclaration de l'incident");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour uploader les images
  const uploadImages = async (incidentId, images) => {
    try {
      console.log(`📤 Début upload de ${images.length} images`);
      
      const uploadPromises = images.map((imageFile, index) => 
        uploadImage(incidentId, imageFile)
      );
      
      const results = await Promise.all(uploadPromises);
      console.log('✅ Toutes les images uploadées avec succès:', results);
      return results;
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload des images:', error);
      throw error;
    }
  };

  // Fonction pour uploader une seule image - CORRIGÉE
  const uploadImage = async (incidentId, imageFile) => {
    try {
      console.log(`📤 Upload image ${imageFile.name} pour incident ${incidentId}`);
      
      // UTILISER DIRECTEMENT incidentService.uploadImage AU LIEU DE FAIRE UN APPEL FETCH MANUEL
      const result = await incidentService.uploadImage(incidentId, imageFile);
      console.log('✅ Image uploadée:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      throw error;
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

  const getSelectedClient = () => clients.find(c => c.id === parseInt(form.clientId));
  const getSelectedProduit = () => produits.find(p => p.id === parseInt(form.produitId));

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
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
        <div className={styles.header}>
          <h4 className={styles.title}>
            <CIcon icon={cilWarning} className={styles.titleIcon} />
            Déclaration d'Incident
          </h4>
          <p className={styles.subtitle}>
            Signalez un problème technique pour une intervention rapide
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            Chargement des données...
          </div>
        ) : (
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
                      value={form.clientId}
                      onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                      required
                    >
                      <option value="">-- Sélectionner un client --</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.nom}
                        </option>
                      ))}
                    </select>
                    {form.clientId && (
                      <div className={styles.selectedBadge}>
                        {getSelectedClient()?.nom}
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
                      value={form.produitId}
                      onChange={(e) => setForm({ ...form, produitId: e.target.value })}
                      required
                    >
                      <option value="">-- Sélectionner un produit --</option>
                      {produits.map(produit => (
                        <option key={produit.id} value={produit.id}>
                          {produit.nom}
                        </option>
                      ))}
                    </select>
                    {form.produitId && (
                      <div className={styles.selectedBadge}>
                        {getSelectedProduit()?.nom}
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
                disabled={isSubmitting || !form.clientId || !form.produitId || !form.description || !form.date_survenu}
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
        )}
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