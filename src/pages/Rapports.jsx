import React from "react";
import { FaTrash, FaDownload } from "react-icons/fa";
import { useRapports } from "../context/RapportContext";
import { toast } from "react-toastify";
import { generateRapportPDF } from "../utils/pdfGenerator";
import "react-toastify/dist/ReactToastify.css";

function Rapports() {
  const { rapports, deleteRapport } = useRapports();

  const handleDelete = (id) => {
    deleteRapport(id);
    toast.error("🗑️ Rapport supprimé");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Tous les rapports</h2>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Client</th>
            <th>Produit</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rapports.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Aucun rapport disponible
              </td>
            </tr>
          ) : (
            rapports.map((r, index) => (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>{r.description}</td>
                <td>{r.client}</td>
                <td>{r.produit}</td>
                <td>{r.date}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleDelete(r.id)}
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => generateRapportPDF(r, r.intervention)}
                    title="Télécharger PDF"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Rapports;
