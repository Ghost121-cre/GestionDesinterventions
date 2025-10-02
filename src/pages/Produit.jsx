import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../assets/css/Produit.css"

function Produit() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState([])
  const [newProduit, setNewProduit] = useState({ id: "", nom: "" })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    if (!newProduit.nom) {
      toast.error("Le nom est requis")
      return
    }

    if (isEditing) {
      setProduits(produits.map(p => (p.id === newProduit.id ? newProduit : p)))
      toast.success("Produit modifié")
    } else {
      setProduits([...produits, { ...newProduit, id: Date.now() }])
      toast.success("Produit ajouté")
    }

    setNewProduit({ id: "", nom: "" })
    setIsEditing(false)
  }

  const handleDelete = (id) => {
    setProduits(produits.filter(p => p.id !== id))
    toast.info("Produit supprimé")
  }

  const handleEdit = (produit) => {
    setNewProduit(produit)
    setIsEditing(true)
    const offcanvas = new window.bootstrap.Offcanvas("#offcanvasProduit")
    offcanvas.show()
  }

  return (
    <div className="container mt-4 produit-container">
      <h3>Produits</h3>
      <div className="mb-3 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate("/parametres")}>
          ← Retour
        </button>
        <button className="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasProduit">
          + Ajouter
        </button>
      </div>

      <table className="table table-striped produit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">Aucun produit</td>
            </tr>
          ) : (
            produits.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nom}</td>
                <td>
                  <i className="bi bi-pencil-square text-primary me-2 action-icon"
                    role="button" title="Modifier"
                    onClick={() => handleEdit(p)} />
                  <i className="bi bi-trash-fill text-danger action-icon"
                    role="button" title="Supprimer"
                    onClick={() => handleDelete(p.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasProduit">
        <div className="offcanvas-header">
          <h5>{isEditing ? "Modifier Produit" : "Nouveau Produit"}</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label>Nom</label>
            <input
              type="text"
              className="form-control"
              value={newProduit.nom}
              onChange={(e) => setNewProduit({ ...newProduit, nom: e.target.value })}
            />
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

export default Produit
