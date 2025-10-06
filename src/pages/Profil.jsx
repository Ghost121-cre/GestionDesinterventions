import React, { useContext, useState } from "react";
import "../assets/css/Profil.css";
import { UserContext } from "../context/UserContext";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilCheck, cilX } from "@coreui/icons";

function Profil() {
  const { user, setUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);

  if (!user) return <p>Utilisateur non connecté</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  return (
    <div className="profil-container">
      <h2 className="profil-title">Profil</h2>

      {/* Header */}
      <div className="profil-header">
        <div className="avatar-wrapper">
          <img src={formData.avatar} alt="avatar" className="profil-avatar" />
          {editMode && (
            <label className="avatar-edit-label">
              <CIcon icon={cilPencil} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        <div className="profil-info">
          <h3 className="profil-name">{formData.prenom} {formData.nom}</h3>
          <p className="profil-role">{formData.role}</p>
        </div>

        <div className="profil-actions">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                <CIcon icon={cilCheck} /> Sauvegarder
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <CIcon icon={cilX} /> Annuler
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              <CIcon icon={cilPencil} /> Modifier
            </button>
          )}
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="profil-card">
        <div className="card-header">
          <h4>Informations personnelles</h4>
        </div>
        <div className="card-grid">
          {["prenom", "nom", "email", "telephone", "bio"].map(field => (
            <div key={field}>
              <p className="label">{field.charAt(0).toUpperCase() + field.slice(1)}</p>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  placeholder={`Entrez votre ${field}`}
                />
              ) : (
                <p className="value">{formData[field] || "-"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Adresse */}
      <div className="profil-card">
        <div className="card-header">
          <h4>Adresse</h4>
        </div>
        <div className="card-grid">
          {["pays", "ville", "codePostal"].map(field => (
            <div key={field}>
              <p className="label">{field.charAt(0).toUpperCase() + field.slice(1)}</p>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  placeholder={`Entrez votre ${field}`}
                />
              ) : (
                <p className="value">{formData[field] || "-"}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profil;
