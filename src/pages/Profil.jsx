import React from 'react';
import "../assets/css/Profil.css";
import userAvatar from "../assets/images/user.png"

function Profil() {
  return (
    <div className="profil-container">
      <h2 className="profil-title">Profile</h2>

      {/* Profile Header */}
      <div className="profil-header">
        <div className="profil-info">
          <img
            src={userAvatar}
            alt="avatar"
            className="profil-avatar"
          />
          <div>
            <h3 className="profil-name">Touré Issouf</h3>
            <p className="profil-role">Stagiaire • Activ', Angré</p>
          </div>
        </div>
        <div className="profil-actions">
          <button className="edit-btn">Edit</button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="profil-card">
        <div className="card-header">
          <h4>Personal Information</h4>
          <button className="edit-btn">Edit</button>
        </div>
        <div className="card-grid">
          <div>
            <p className="label">Nom</p>
            <p className="value">Touré</p>
          </div>
          <div>
            <p className="label">Prénom</p>
            <p className="value">Issouf</p>
          </div>
          <div>
            <p className="label">Adresse email</p>
            <p className="value">toureissouf390@gmail.com</p>
          </div>
          <div>
            <p className="label">Téléphone</p>
            <p className="value">+225 07 06 05 81 85</p>
          </div>
          <div className="full-row">
            <p className="label">Bio</p>
            <p className="value">Stagiaire</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="profil-card">
        <div className="card-header">
          <h4>Address</h4>
          <button className="edit-btn">Edit</button>
        </div>
        <div className="card-grid">
          <div>
            <p className="label">Pays</p>
            <p className="value">Côte d'Ivoire</p>
          </div>
          <div>
            <p className="label">Ville/État</p>
            <p className="value">Abidjan</p>
          </div>
          <div>
            <p className="label">Code Postal</p>
            <p className="value">ERT 2489</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profil
