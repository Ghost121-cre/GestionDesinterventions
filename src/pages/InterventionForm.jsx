import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInterventions } from "../context/InterventionContext";
import { useIncident } from "../context/IncidentContext";
import { dataService } from "../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../assets/css/InterventionForm.module.css";
import { toast } from "react-toastify";
import CIcon from "@coreui/icons-react";
import {
  cilCalendar,
  cilUser,
  cilDescription,
  cilImage,
  cilWarning,
  cilPlus,
  cilX,
  cilChevronLeft,
  cilChevronRight,
  cilZoom,
  cilCheckCircle,
} from "@coreui/icons";

function InterventionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addIntervention } = useInterventions();
  const { incidents } = useIncident();

  const incidentFromNav = location.state?.incident;
  const techniciens = ["Nacro", "Youssouf", "Issouf"];
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour les données
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    clientId: "",
    produitId: "",
    description: "",
    datetime: "",
    technicien: "",
    incidentId: "",
    images: [],
    priorite: "medium",
  });

  const [previews, setPreviews] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Charger les données clients et produits
  useEffect(() => {
    loadClientsAndProduits();
  }, []);

  const loadClientsAndProduits = async () => {
    try {
      setLoading(true);
      const [clientsData, produitsData] = await Promise.all([
        dataService.getClients(),
        dataService.getProduits(),
      ]);

      console.log("📥 Clients chargés:", clientsData);
      console.log("📥 Produits chargés:", produitsData);

      setClients(clientsData);
      setProduits(produitsData);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Debug des données
  useEffect(() => {
    console.log("🔍 DEBUG - Clients:", clients);
    console.log("🔍 DEBUG - Produits:", produits);
    console.log(
      "🔍 DEBUG - Form clientId:",
      form.clientId,
      "disponible:",
      clients.some((c) => c.id.toString() === form.clientId)
    );
    console.log(
      "🔍 DEBUG - Form produitId:",
      form.produitId,
      "disponible:",
      produits.some((p) => p.id.toString() === form.produitId)
    );
  }, [clients, produits, form.clientId, form.produitId]);

  // Pré-remplissage depuis navigation
  useEffect(() => {
    if (incidentFromNav) {
      console.log("📥 Incident reçu pour pré-remplissage:", incidentFromNav);

      setForm((prev) => ({
        ...prev,
        clientId: incidentFromNav.clientId?.toString() || "",
        produitId: incidentFromNav.produitId?.toString() || "",
        description: incidentFromNav.description,
        incidentId: incidentFromNav.id.toString(),
        images: incidentFromNav.images || [],
        priorite: incidentFromNav.priorite || "medium",
      }));

      // Charger les previews d'images
      if (incidentFromNav.images && incidentFromNav.images.length > 0) {
        const imageUrls = incidentFromNav.images.map((img) => {
          if (typeof img === "string") return img;
          if (img.chemin) return `https://localhost:7134${img.chemin}`;
          return URL.createObjectURL(img);
        });
        setPreviews(imageUrls);
      }
    }
  }, [incidentFromNav]);

  // Pré-remplissage lors de sélection d'un incident
  useEffect(() => {
    if (form.incidentId && clients.length > 0 && produits.length > 0) {
      const selectedIncident = incidents.find(
        (i) => i.id === Number(form.incidentId) && i.statut === "non résolu"
      );

      if (selectedIncident) {
        console.log("📥 Incident sélectionné:", selectedIncident);

        let previewUrls = [];
        if (selectedIncident.images && selectedIncident.images.length > 0) {
          previewUrls = selectedIncident.images.map((img) => {
            if (typeof img === "string") return img;
            if (img.chemin) return `https://localhost:7134${img.chemin}`;
            return URL.createObjectURL(img);
          });
        }

        setForm((prev) => ({
          ...prev,
          clientId: selectedIncident.clientId?.toString() || "",
          produitId: selectedIncident.produitId?.toString() || "",
          description: selectedIncident.description,
          images: selectedIncident.images || [],
          priorite: selectedIncident.priorite || "medium",
        }));

        setPreviews(previewUrls);
      }
    }
  }, [form.incidentId, incidents, clients, produits]);

  // Fonction utilitaire pour obtenir le nom du client
  const getClientName = (clientId) => {
    if (!clientId) return "Non sélectionné";
    const client = clients.find((c) => c.id.toString() === clientId.toString());
    return client ? client.nom : `Client #${clientId} (non trouvé)`;
  };

  // Fonction utilitaire pour obtenir le nom du produit
  const getProductName = (produitId) => {
    if (!produitId) return "Non sélectionné";
    const produit = produits.find(
      (p) => p.id.toString() === produitId.toString()
    );
    return produit ? produit.nom : `Produit #${produitId} (non trouvé)`;
  };

  // Gestion images multiples
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.images.length > 10) {
      toast.error("❌ Maximum 10 images autorisées");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index) => {
    const newImages = [...form.images];
    const newPreviews = [...previews];

    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setForm({ ...form, images: newImages });
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.clientId ||
      !form.produitId ||
      !form.description ||
      !form.datetime
    ) {
      toast.error("⚠️ Veuillez remplir tous les champs obligatoires !");
      return;
    }

    setIsSubmitting(true);

    try {
      const newIntervention = {
        clientId: parseInt(form.clientId),
        produitId: parseInt(form.produitId),
        description: form.description,
        datetime: form.datetime,
        technicien: form.technicien,
        incidentId: form.incidentId ? parseInt(form.incidentId) : null,
        images: form.images,
        priorite: form.priorite,
        statut: "En attente",
        createdAt: new Date().toISOString(),
      };

      await addIntervention(newIntervention);
      toast.success("✅ Intervention ajoutée avec succès !");

      // Reset formulaire
      setForm({
        clientId: "",
        produitId: "",
        description: "",
        datetime: "",
        technicien: "",
        incidentId: "",
        images: [],
        priorite: "medium",
      });
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);
      setCurrentStep(1);

      setTimeout(() => navigate("/interventions"), 1500);
    } catch (error) {
      toast.error("❌ Erreur lors de l'ajout de l'intervention");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevImage = () =>
    setLightboxIndex((prev) => (prev === 0 ? previews.length - 1 : prev - 1));
  const nextImage = () =>
    setLightboxIndex((prev) => (prev === previews.length - 1 ? 0 : prev + 1));
  const toggleZoom = () => setZoomed((prev) => !prev);

  const nextStep = () => {
    if (!form.clientId || !form.produitId || !form.description) {
      toast.error("⚠️ Veuillez remplir les informations de base");
      return;
    }
    setCurrentStep(2);
  };

  const prevStep = () => setCurrentStep(1);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Chargement des données...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav aria-label="breadcrumb" className={styles.breadcrumb}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item" onClick={() => navigate("/Accueil")}>
            <CIcon icon={cilChevronLeft} className={styles.breadcrumbIcon} />
            Accueil
          </li>
          <li className="breadcrumb-item active">Nouvelle Intervention</li>
        </ol>
      </nav>

      <div className={styles.card}>
        <div className={styles.header}>
          <h4 className={styles.title}>
            <CIcon icon={cilPlus} className={styles.titleIcon} />
            Nouvelle Intervention
          </h4>
          <div className={styles.steps}>
            <div
              className={`${styles.step} ${
                currentStep >= 1 ? styles.active : ""
              }`}
            >
              <span className={styles.stepNumber}>1</span>
              <span className={styles.stepLabel}>Informations</span>
            </div>
            <div className={styles.stepSeparator}></div>
            <div
              className={`${styles.step} ${
                currentStep >= 2 ? styles.active : ""
              }`}
            >
              <span className={styles.stepNumber}>2</span>
              <span className={styles.stepLabel}>Planification</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              {/* Incident associé */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <CIcon icon={cilWarning} className={styles.labelIcon} />
                  Incident associé (facultatif)
                </label>
                <select
                  className={styles.select}
                  value={form.incidentId || ""}
                  onChange={(e) =>
                    setForm({ ...form, incidentId: e.target.value })
                  }
                >
                  <option value="">
                    -- Sélectionner un incident non résolu --
                  </option>
                  {incidents
                    .filter((i) => i.statut === "non résolu")
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        #{i.id} - {i.client?.nom || `Client #${i.clientId}`} -{" "}
                        {i.produit?.nom || `Produit #${i.produitId}`} -
                        Priorité:{" "}
                        {i.priorite === "low"
                          ? "Basse"
                          : i.priorite === "medium"
                          ? "Moyenne"
                          : "Haute"}
                      </option>
                    ))}
                </select>
              </div>

              {/* Client & Produit - CORRIGÉ */}
              <div className="row">
                <div className="col-md-6">
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Client *</label>
                    <select
                      className={styles.select}
                      value={form.clientId}
                      onChange={(e) =>
                        setForm({ ...form, clientId: e.target.value })
                      }
                      required
                      disabled={!!form.incidentId}
                    >
                      <option value="">-- Sélectionner un client --</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.nom}
                        </option>
                      ))}
                    </select>
                    {form.clientId && (
                      <div className={styles.selectedInfo}>
                        Sélectionné: {getClientName(form.clientId)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Produit *</label>
                    <select
                      className={styles.select}
                      value={form.produitId}
                      onChange={(e) =>
                        setForm({ ...form, produitId: e.target.value })
                      }
                      required
                      disabled={!!form.incidentId}
                    >
                      <option value="">-- Sélectionner un produit --</option>
                      {produits.map((produit) => (
                        <option key={produit.id} value={produit.id}>
                          {produit.nom}
                        </option>
                      ))}
                    </select>
                    {form.produitId && (
                      <div className={styles.selectedInfo}>
                        Sélectionné: {getProductName(form.produitId)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Priorité */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Priorité
                  {form.incidentId && (
                    <span className={styles.autoFilledBadge}>
                      (Héritée de l'incident)
                    </span>
                  )}
                </label>
                <div className={styles.priorityGroup}>
                  {[
                    { value: "low", label: "Basse", color: "#10b981" },
                    { value: "medium", label: "Moyenne", color: "#f59e0b" },
                    { value: "high", label: "Haute", color: "#ef4444" },
                  ].map((priority) => (
                    <label
                      key={priority.value}
                      className={styles.priorityOption}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={form.priorite === priority.value}
                        onChange={(e) =>
                          setForm({ ...form, priorite: e.target.value })
                        }
                        className={styles.priorityInput}
                        disabled={!!form.incidentId}
                      />
                      <span
                        className={styles.priorityLabel}
                        style={{
                          borderColor:
                            form.priorite === priority.value
                              ? priority.color
                              : "#e5e7eb",
                          backgroundColor:
                            form.priorite === priority.value
                              ? `${priority.color}15`
                              : "transparent",
                          opacity: form.incidentId ? 0.7 : 1,
                        }}
                      >
                        <span
                          className={styles.priorityDot}
                          style={{ backgroundColor: priority.color }}
                        ></span>
                        {priority.label}
                      </span>
                    </label>
                  ))}
                </div>
                {form.incidentId && (
                  <div className={styles.priorityHelp}>
                    La priorité est automatiquement héritée de l'incident
                    sélectionné
                  </div>
                )}
              </div>

              {/* Upload images */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <CIcon icon={cilImage} className={styles.labelIcon} />
                  Images (max. 10)
                </label>

                {previews.length > 0 && (
                  <div className={styles.imageCounter}>
                    {previews.length} image(s) sélectionnée(s)
                  </div>
                )}

                <div
                  className={styles.uploadArea}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CIcon
                    icon={cilImage}
                    size="2xl"
                    className={styles.uploadIcon}
                  />
                  <p className={styles.uploadText}>
                    {previews.length > 0
                      ? "Ajouter plus d'images"
                      : "Cliquer pour ajouter des images"}
                  </p>
                  <small className={styles.uploadHint}>
                    PNG, JPG, JPEG jusqu'à 5MB
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
                      {previews.map((src, idx) => (
                        <div key={idx} className={styles.imageWrapper}>
                          <img
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            className={styles.previewImage}
                            onClick={() => setLightboxIndex(idx)}
                          />
                          <button
                            type="button"
                            className={styles.removeImageBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            title="Supprimer l'image"
                          >
                            <CIcon icon={cilX} />
                          </button>
                          <div className={styles.imageNumber}>{idx + 1}</div>
                        </div>
                      ))}
                    </div>

                    {previews.length > 1 && (
                      <button
                        type="button"
                        className={styles.clearAllBtn}
                        onClick={() => {
                          previews.forEach((url) => URL.revokeObjectURL(url));
                          setPreviews([]);
                          setForm({ ...form, images: [] });
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
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
                  Description *
                </label>
                <textarea
                  className={styles.textarea}
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  readOnly={!!form.incidentId}
                  placeholder="Décrivez en détail l'intervention à réaliser..."
                  maxLength="500"
                />
                <div className={styles.charCount}>
                  {form.description.length} / 500 caractères
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={nextStep}
                >
                  Suivant
                  <CIcon icon={cilChevronRight} className={styles.btnIcon} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.stepContent}>
              <h5 className={styles.sectionTitle}>
                <CIcon icon={cilCalendar} className={styles.sectionIcon} />
                Planification de l'intervention
              </h5>

              <div className="row">
                <div className="col-md-6">
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <CIcon icon={cilCalendar} className={styles.labelIcon} />
                      Date et heure *
                    </label>
                    <input
                      type="datetime-local"
                      className={styles.input}
                      value={form.datetime}
                      onChange={(e) =>
                        setForm({ ...form, datetime: e.target.value })
                      }
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <CIcon icon={cilUser} className={styles.labelIcon} />
                      Technicien assigné
                    </label>
                    <select
                      className={styles.select}
                      value={form.technicien}
                      onChange={(e) =>
                        setForm({ ...form, technicien: e.target.value })
                      }
                    >
                      <option value="">-- Sélectionner un technicien --</option>
                      {techniciens.map((t, idx) => (
                        <option key={idx} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Récapitulatif - CORRIGÉ */}
              <div className={styles.summary}>
                <h6 className={styles.summaryTitle}>Récapitulatif</h6>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Client:</span>
                    <span className={styles.summaryValue}>
                      {getClientName(form.clientId)}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Produit:</span>
                    <span className={styles.summaryValue}>
                      {getProductName(form.produitId)}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Priorité:</span>
                    <span
                      className={styles.summaryValue}
                      style={{ color: getPriorityColor(form.priorite) }}
                    >
                      {form.priorite === "low"
                        ? "Basse"
                        : form.priorite === "medium"
                        ? "Moyenne"
                        : "Haute"}
                    </span>
                  </div>
                  {form.incidentId && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Incident lié:</span>
                      <span className={styles.summaryValue}>
                        #{form.incidentId}
                      </span>
                    </div>
                  )}
                  {previews.length > 0 && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Images:</span>
                      <span className={styles.summaryValue}>
                        {previews.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={prevStep}
                >
                  <CIcon icon={cilChevronLeft} className={styles.btnIcon} />
                  Retour
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner}></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilCheckCircle} className={styles.btnIcon} />
                      Créer l'intervention
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div
          className={styles.modalOverlay}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
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
                className={`${styles.modalImage} ${
                  zoomed ? styles.zoomed : ""
                }`}
                onClick={toggleZoom}
              />
              <button className={styles.zoomHint} onClick={toggleZoom}>
                <CIcon icon={cilZoom} />
                {zoomed ? "Dézoomer" : "Zoomer"}
              </button>
            </div>

            {previews.length > 1 && (
              <>
                <button
                  className={styles.navBtn}
                  onClick={prevImage}
                  title="Image précédente"
                >
                  <CIcon icon={cilChevronLeft} />
                </button>
                <button
                  className={styles.navBtn}
                  onClick={nextImage}
                  title="Image suivante"
                >
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

export default InterventionForm;
