import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "../assets/css/Produit.css"

// ✅ CoreUI icons
import CIcon from "@coreui/icons-react"
import { cilPencil, cilTrash, cilPlus } from "@coreui/icons"

function Produit() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState([])
  const [newProduit, setNewProduit] = useState({ id: "", nom: "" })
  const [isEditing, setIsEditing] = useState(false)

  // ✅ Charger depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("produits")
    if (saved) setProduits(JSON.parse(saved))
  }, [])

  // ✅ Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem("produits", JSON.stringify(produits))
  }, [produits])

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
    <div className="produit-page">
      <div className="container-fluid">
        {/* ✅ Fil d’Ariane */}
        <div className="breadcrumb-wrapper px-4 mt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li
                className="breadcrumb-item"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/parametres")}
              >
                Paramètres
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Produits
              </li>
            </ol>
          </nav>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Produits</h3>
          <button
            className="btn-Add"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasProduit"
            onClick={() => {
              setIsEditing(false)
              setNewProduit({ id: "", nom: "" })
            }}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Ajouter
          </button>
        </div>
      </div>

      {/* ✅ Container principal */}
      <div className="container mt-3 produit-container">
        <table className="table produit-table align-middle">
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
                <td colSpan="3" className="text-center text-muted py-4">
                  Aucun produit
                </td>
              </tr>
            ) : (
              produits.map((p) => (
                <tr key={p.id}>
                  <td data-label="ID">{p.id}</td>
                  <td data-label="Nom">{p.nom}</td>
                  <td data-label="Actions">
                    <CIcon
                      icon={cilPencil}
                      className="text-primary me-3 action-icon"
                      role="button"
                      title="Modifier"
                      onClick={() => handleEdit(p)}
                    />
                    <CIcon
                      icon={cilTrash}
                      className="text-danger action-icon"
                      role="button"
                      title="Supprimer"
                      onClick={() => handleDelete(p.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✅ Offcanvas */}
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasProduit">
          <div className="offcanvas-header">
            <h5>{isEditing ? "Modifier un produit" : "Nouveau produit"}</h5>
            <button className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body">
            <div className="mb-3">
              <label>Nom du produit</label>
              <input
                type="text"
                className="form-control"
                value={newProduit.nom}
                onChange={(e) => setNewProduit({ ...newProduit, nom: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="btn btn-success"
              data-bs-dismiss="offcanvas"
              onClick={handleSave}
            >
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default Produit
