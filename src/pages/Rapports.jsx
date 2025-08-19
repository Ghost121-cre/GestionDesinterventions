import React from 'react'
import DataTable from "react-data-table-component"

// Exemple de colonnes
const columns = [
  {
    name: "Nom",
    selector: row => row.name,
    sortable: true
  },
  {
    name: "Email",
    selector: row => row.email,
    sortable: true
  },
  {
    name: "Téléphone",
    selector: row => row.phone
  }
]

// Exemple de données
const data = [
  { id: 1, name: "Moussa Traoré", email: "moussa@example.com", phone: "+225 01020304" },
  { id: 2, name: "Awa Koné", email: "awa@example.com", phone: "+225 05060708" },
  { id: 3, name: "Jean Kouadio", email: "jean@example.com", phone: "+225 11121314" }
]

function Rapports() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Liste des utilisateurs</h2>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
      />
    </div>
  )
}

export default Rapports
