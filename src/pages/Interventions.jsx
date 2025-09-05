import React, { useState } from 'react'
import DataTable from "react-data-table-component"
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa"
import "../assets/css/OffCanvas.css"

const columns = [
  { name: "Numéro", selector: row => row.Numéro, sortable: true },
  { name: "lieu", selector: row => row.lieu, sortable: true },
  { name: "Contenu", selector: row => row.contenu, sortable: true },
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
  { id: 1, Numéro: "001", lieu: "SIB", contenu: "Contenu 1", Date_debut: "1/08/2025", Date_fin: "06/08/2025" },
  { id: 2, Numéro: "002", lieu: "BNB", contenu: "Contenu 2", Date_debut: "02/08/2025", Date_fin: "07/08/2025" },
  { id: 3, Numéro: "003", lieu: "ACTIV", contenu: "Contenu 3", Date_debut: "03/08/2025", Date_fin: "08/08/2025" },
  { id: 4, Numéro: "004", lieu: "PLATEAU", contenu: "Contenu 4", Date_debut: "04/08/2025", Date_fin: "06/08/2025" },
  { id: 5, Numéro: "005", lieu: "ANGRE", contenu: "Contenu 5", Date_debut: "05/08/2025", Date_fin: "07/08/2025" },
  { id: 6, Numéro: "006", lieu: "BOUAKE", contenu: "Contenu 6", Date_debut: "06/08/2025", Date_fin: "08/08/2025" },
  { id: 7, Numéro: "007", lieu: "YAMOUSSOUKRO", contenu: "Contenu 7", Date_debut: "07/08/2025", Date_fin: "06/08/2025" },
  { id: 8, Numéro: "008", lieu: "US", contenu: "Contenu 8", Date_debut: "08/08/2025", Date_fin: "07/08/2025" },
  { id: 9, Numéro: "009", lieu: "BAMAKO", contenu: "Contenu 9", Date_debut: "09/08/2025", Date_fin: "08/08/2025" },
  { id: 10, Numéro: "010", lieu: "NIGERIA", contenu: "Contenu 10", Date_debut: "05/08/2025", Date_fin: "06/08/2025" },
  { id: 11, Numéro: "011", lieu: "MAN", contenu: "Contenu 11", Date_debut: "10/08/2025", Date_fin: "07/08/2025" },
  { id: 12, Numéro: "012", lieu: "ODIENNE", contenu: "Contenu 12", Date_debut: "11/08/2025", Date_fin: "08/08/2025" }
]
function Intervention() {
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
    item.lieu.toLowerCase().includes(filterText.toLowerCase()) ||
    item.contenu.toLowerCase().includes(filterText.toLowerCase()) ||
    item.Date_debut.toLowerCase().includes(filterText.toLowerCase()) ||
    item.Date_fin.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="rapport-container">
      <h2>La listes des intervention en cours</h2>

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
export default Intervention;
