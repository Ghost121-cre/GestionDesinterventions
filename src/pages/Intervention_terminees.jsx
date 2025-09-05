import React, { useState } from 'react'
import DataTable from "react-data-table-component"
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa"
import "../assets/css/OffCanvas.css"

const columns = [
  { name: "Numéro", selector: row => row.Numéro, sortable: true },
  { name: "Contenu", selector: row => row.Contenu, sortable: true },
  { name: "Date de début", selector: row => row.Date_debut, sortable: true },
  { name: "Date de fin", selector: row => row.Date_fin, sortable: true },
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

const data = [
  { id: 1, Numéro: "001", Contenu: "Probème Technique", Date_debut: "05/08/2025", Date_fin: "06/08/2025" },
  { id: 2, Numéro: "002", Contenu: "Maintenance", Date_debut: "06/08/2025", Date_fin: "07/08/2025" },
  { id: 3, Numéro: "003", Contenu: "Bug", Date_debut: "07/08/2025", Date_fin: "08/08/2025" },
  { id: 4, Numéro: "004", Contenu: "Probème Technique", Date_debut: "05/08/2025", Date_fin: "06/08/2025" },
  { id: 5, Numéro: "005", Contenu: "Maintenance", Date_debut: "06/08/2025", Date_fin: "07/08/2025" },
  { id: 6, Numéro: "006", Contenu: "Bug", Date_debut: "07/08/2025", Date_fin: "08/08/2025" },
  { id: 7, Numéro: "007", Contenu: "Probème Technique", Date_debut: "05/08/2025", Date_fin: "06/08/2025" },
  { id: 8, Numéro: "008", Contenu: "Maintenance", Date_debut: "06/08/2025", Date_fin: "07/08/2025" },
  { id: 9, Numéro: "009", Contenu: "Bug", Date_debut: "07/08/2025", Date_fin: "08/08/2025" },
  { id: 10, Numéro: "010", Contenu: "Probème Technique", Date_debut: "05/08/2025", Date_fin: "06/08/2025" },
  { id: 11, Numéro: "011", Contenu: "Maintenance", Date_debut: "06/08/2025", Date_fin: "07/08/2025" },
  { id: 12, Numéro: "012", Contenu: "Bug", Date_debut: "07/08/2025", Date_fin: "08/08/2025" }
]
function InterventionTerminees() {
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false); // ✅

  const handleChangeRowsPerPage = (n) => {
    setRowsPerPage(n);
    setResetPaginationToggle(prev => !prev); // ✅ reset page 1
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu mets ta logique pour ajouter un rapport
    alert("Rapport ajouté !");
    setIsOpen(false);
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  const filteredData = data.filter(item =>
    item.Numéro.toLowerCase().includes(filterText.toLowerCase()) ||
    item.Contenu.toLowerCase().includes(filterText.toLowerCase()) ||
    item.Date_debut.toLowerCase().includes(filterText.toLowerCase()) ||
    item.Date_fin.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="rapport-container">
      <h2>Liste des interventions terminées</h2>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="left-tools">
          <label>
            Show
            <select
              value={rowsPerPage}
              onChange={(e) => handleChangeRowsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            entries
          </label>
        </div>

        <div className="right-tools">
          <input
            type="text"
            placeholder="Recherches..."
            value={filterText}
            onChange={e => handleChangeRowsPerPage(rowsPerPage) || setFilterText(e.target.value)}
            className="search-input"
          />
          <button className="btn-add" onClick={() => setIsOpen(s => !s)}>Ajouter</button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        key={rowsPerPage}                      // ✅ force le remount -> applique le nouveau perPage
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
        keyField="id"
        paginationPerPage={rowsPerPage}       // ✅ contrôlé par ton "Show"
        paginationRowsPerPageOptions={[]}     // ✅ on supprime le sélecteur natif
        paginationResetDefaultPage={resetPaginationToggle} // ✅ revient à la page 1
      />

      {/* Off-canvas ... */}
      <div className={`offcanvas-form ${isOpen ? "open" : ""}`}>
        <h2>Ajouter un rapport</h2>
        <form onSubmit={handleSubmit}>
          <label>Numéro : <input type="text" required /></label>
          <label>Contenu : <input type="text" required /></label>
          <label>Date de début : <input type="text" required /></label>
          <label>Date de fin : <input type="text" required /></label>
          <button type="submit">Envoyer</button>
        </form>
      </div>
      {isOpen && <div className="overlay" onClick={toggleForm}></div>}
    </div>
  );
}
export default InterventionTerminees
