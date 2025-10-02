import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../assets/css/CompteUtilisateur.css"

// 🔔 Import contexte
import { NotificationContext } from "../context/NotificationContext"

function CompteUtilisateur() {
  const navigate = useNavigate()
  const { addNotification } = useContext(NotificationContext) // ✅ utilisation du contexte

  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ id: "", nom: "", email: "", role: "" })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    if (!newUser.nom || !newUser.email) {
      toast.error("Nom et Email requis")
      return
    }

    if (isEditing) {
      setUsers(users.map(u => (u.id === newUser.id ? newUser : u)))
      toast.success("Utilisateur modifié")
      addNotification(`Utilisateur modifié : ${newUser.nom}`) // 🔔
    } else {
      const createdUser = { ...newUser, id: Date.now() }
      setUsers([...users, createdUser])
      toast.success("Utilisateur ajouté")
      addNotification(`Nouvel utilisateur ajouté : ${newUser.nom}`) // 🔔
    }

    setNewUser({ id: "", nom: "", email: "", role: "" })
    setIsEditing(false)
  }

  const handleDelete = (id) => {
    const deletedUser = users.find(u => u.id === id)
    setUsers(users.filter(u => u.id !== id))
    toast.info("Utilisateur supprimé")
    addNotification(`Utilisateur supprimé : ${deletedUser?.nom || "Inconnu"}`) // 🔔
  }

  const handleEdit = (user) => {
    setNewUser(user)
    setIsEditing(true)
    const offcanvas = new window.bootstrap.Offcanvas("#offcanvasUser")
    offcanvas.show()
  }

  return (
    <div className="container mt-4 user-container">
      <h3>Comptes Utilisateurs</h3>
      <div className="mb-3 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate("/parametres")}>
          ← Retour
        </button>
        <button className="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser">
          + Ajouter
        </button>
      </div>

      <table className="table table-striped user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Aucun utilisateur</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nom}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <i className="bi bi-pencil-square text-primary me-2 action-icon"
                    role="button" title="Modifier"
                    onClick={() => handleEdit(u)} />
                  <i className="bi bi-trash-fill text-danger action-icon"
                    role="button" title="Supprimer"
                    onClick={() => handleDelete(u.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasUser">
        <div className="offcanvas-header">
          <h5>{isEditing ? "Modifier Utilisateur" : "Nouveau Utilisateur"}</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label>Nom</label>
            <input type="text" className="form-control"
              value={newUser.nom} onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control"
              value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <label>Rôle</label>
            <input type="text" className="form-control"
              value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} />
          </div>
          <button type="button" className="btn btn-success"
            data-bs-dismiss="offcanvas" onClick={handleSave}>
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default CompteUtilisateur
