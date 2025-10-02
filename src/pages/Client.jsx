import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../assets/css/Client.css"


function Client() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [newClient, setNewClient] = useState({ id: "", nom: "", adresse: "", email: "" })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    if (!newClient.nom || !newClient.email) {
      toast.error("Nom et Email requis")
      return
    }

    if (isEditing) {
      setClients(clients.map(c => (c.id === newClient.id ? newClient : c)))
      toast.success("Client modifié")
    } else {
      setClients([...clients, { ...newClient, id: Date.now() }])
      toast.success("Client ajouté")
    }

    setNewClient({ id: "", nom: "", adresse: "", email: "" })
    setIsEditing(false)
  }

  const handleDelete = (id) => {
    setClients(clients.filter(c => c.id !== id))
    toast.info("Client supprimé")
  }

  const handleEdit = (client) => {
    setNewClient(client)
    setIsEditing(true)
    const offcanvas = new window.bootstrap.Offcanvas("#offcanvasClient")
    offcanvas.show()
  }

  return (
    <div className="container mt-4 client-container">
      <h3>Clients</h3>
      <div className="mb-3 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate("/parametres")}>
          ← Retour
        </button>
        <button className="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasClient">
          + Ajouter
        </button>
      </div>

      <table className="table table-striped client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Aucun client</td>
            </tr>
          ) : (
            clients.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nom}</td>
                <td>{c.adresse}</td>
                <td>{c.email}</td>
                <td>
                  <i className="bi bi-pencil-square text-primary me-2 action-icon"
                    role="button" title="Modifier"
                    onClick={() => handleEdit(c)} />
                  <i className="bi bi-trash-fill text-danger action-icon"
                    role="button" title="Supprimer"
                    onClick={() => handleDelete(c.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasClient">
        <div className="offcanvas-header">
          <h5>{isEditing ? "Modifier Client" : "Nouveau Client"}</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label>Nom</label>
            <input type="text" className="form-control"
              value={newClient.nom} onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })} />
          </div>
          <div className="mb-3">
            <label>Adresse</label>
            <input type="text" className="form-control"
              value={newClient.adresse} onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control"
              value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
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

export default Client
