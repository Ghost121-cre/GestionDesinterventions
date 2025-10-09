// src/pages/Incident.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useIncident } from "../context/IncidentContext";
import styles from "../assets/css/Incident.module.css";

function Incident() {
  const { incidents, handleDelete } = useIncident();
  const [activeTab, setActiveTab] = useState("nonresolu");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([]);

  // 🔎 Filtrage selon onglet, recherche et dates
  const filteredIncidents = incidents
    .filter(i => i.statut === (activeTab === "nonresolu" ? "non résolu" : "résolu"))
    .filter(i =>
      search === "" ||
      i.client.toLowerCase().includes(search.toLowerCase()) ||
      i.produit.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter(i => {
      if (startDate && endDate) {
        const dateField = activeTab === "nonresolu" ? i.date_survenu : i.date_resolu || i.date_survenu;
        return dateField >= startDate && dateField <= endDate;
      }
      return true;
    });

  const totalPages = Math.ceil(filteredIncidents.length / rowsPerPage);
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Navigation lightbox
  const prevImage = () =>
    setLightboxIndex(prev => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  const nextImage = () =>
    setLightboxIndex(prev => (prev === lightboxImages.length - 1 ? 0 : prev + 1));

  return (
    <div className={styles.container}>
      {/* Onglets */}
      <ul className={`${styles.tabs} nav nav-tabs`}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "nonresolu" ? "active" : ""}`}
            onClick={() => { setActiveTab("nonresolu"); setCurrentPage(1); }}
          >
            Non résolu ({incidents.filter(i => i.statut === "non résolu").length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "resolu" ? "active" : ""}`}
            onClick={() => { setActiveTab("resolu"); setCurrentPage(1); }}
          >
            Résolu ({incidents.filter(i => i.statut === "résolu").length})
          </button>
        </li>
      </ul>

      {/* Filtres */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Recherche..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className={styles.inputFilter}
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className={styles.inputFilter}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className={styles.inputFilter}
        />
      </div>

      {/* Tableau */}
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>ID</th>
            <th>Client</th>
            <th>Produit</th>
            <th>Images</th>
            <th>Description</th>
            <th>{activeTab === "resolu" ? "Date Résolu" : "Date Survenu"}</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedIncidents.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">Aucun incident trouvé.</td>
            </tr>
          ) : (
            paginatedIncidents.map(i => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.client}</td>
                <td>{i.produit}</td>
                <td>
                  <div className={styles.previewContainer}>
                    {i.images && i.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(img)}
                        alt={`img-${idx}`}
                        className={styles.previewImage}
                        onClick={() => {
                          setLightboxImages(i.images.map(img => URL.createObjectURL(img)));
                          setLightboxIndex(idx);
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td>{i.description}</td>
                <td>{activeTab === "resolu" ? (i.date_resolu || i.date_survenu) : i.date_survenu}</td>
                <td>
                  <span className={i.statut === "résolu" ? styles.badgeResolved : styles.badgePending}>
                    {i.statut}
                  </span>
                </td>
                <td>
                  <i className="bi bi-trash-fill text-danger"
                    title="Supprimer"
                    onClick={() => handleDelete(i.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.activePage : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.modalCloseFixed} onClick={() => setLightboxIndex(null)}>✕</button>
            <button className={styles.navLeft} onClick={prevImage}>‹</button>
            <img
              src={lightboxImages[lightboxIndex]}
              alt="Aperçu"
              className={styles.modalImage}
            />
            <button className={styles.navRight} onClick={nextImage}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Incident;
