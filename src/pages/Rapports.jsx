import React, { useState } from 'react'
import DataTable from "react-data-table-component"
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa"
import "../assets/css/Rapport.css"
import "../assets/css/OffCanvas.css"

// Exemple de colonnes
const columns = [
  {
    name: "Numéro",
    selector: row => row.Numéro,
    sortable: true
  },
  {
    name: "Contenu",
    selector: row => row.Contenu,
    sortable: true
  },
  {
    name: "Date de début",
    selector: row => row.Date_debut,
    sortable: true
  },
  {
    name: "Date de fin",
    selector: row => row.Date_fin,
    sortable: true
  },
  {
    name: "Action",
    cell: row => (
      <div className="action-buttons">
        <button className="btn-edit"><FaEdit /></button>
        <button className="btn-delete"><FaTrash /></button>
        <button className="btn-download"><FaDownload /></button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true
  }
]

// Exemple de données
const data = [
  { id: 1, Numéro: "001", Contenu: "Probème Technique", Date_debut: "05/08/2025", Date_fin: "06/08/2025" },
  { id: 2, Numéro: "002", Contenu: "Maintenance", Date_debut: "06/08/2025", Date_fin: "07/08/2025" },
  { id: 3, Numéro: "003", Contenu: "Bug", Date_debut: "07/08/2025", Date_fin: "08/08/2025" }
]

function Rapports() {
  const [filterText, setFilterText] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Filtrage
  const filteredData = data.filter(item =>
  item.Numéro.toLowerCase().includes(filterText.toLowerCase()) ||
  item.Contenu.toLowerCase().includes(filterText.toLowerCase()) ||
  item.Date_debut.toLowerCase().includes(filterText.toLowerCase()) ||
  item.Date_fin.toLowerCase().includes(filterText.toLowerCase())
)

  // Toggle offcanvas
  const toggleForm = () => {
    setIsOpen(!isOpen)
  }

  // Soumission formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Formulaire soumis ✅")
    setIsOpen(false) // fermer après envoi
  }

  return (
    <div className='rapport-container'>
      <h2>Liste des rapports</h2>

      {/* Barre d’outils */}
      <div className="table-toolbar">
        <input
          type="text"
          placeholder="Recherches..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="search-input"
        />
        <button className="btn-add" onClick={toggleForm}>Ajouter</button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
      />

      {/* Off-canvas formulaire */}
      <div className={`offcanvas-form ${isOpen ? "open" : ""}`}>
        <h2>Ajouter un rapport</h2>
        <form onSubmit={handleSubmit}>
          <label>
            numéro :
            <input type="text" required />
          </label>
          <label>
            Contenu :
            <input type="text" required />
          </label>
          <label>
            Date de début :
            <input type="text" required />
          </label>
          <label>
            Date de fin :
            <input type="text" required />
          </label>
          <button type="submit">Envoyer</button>
        </form>
      </div>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={toggleForm}></div>}
    </div>
  )
}

export default Rapports
