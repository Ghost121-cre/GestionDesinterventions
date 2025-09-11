import React, { useState, useEffect } from "react";
import "../assets/css/Interventions.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

function Interventions() {
  const [activeTab, setActiveTab] = useState("enattente");
  const [filterClient, setFilterClient] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [interventionsEnAttente, setInterventionsEnAttente] = useState([
    { id: 1, titre: "Impossible de Télécharger un fichier lourd", client: "SIB", date: "2025-09-01", statut: "En attente" },
    { id: 2, titre: "Pointage impossible", client: "BNB", date: "2025-09-02", statut: "En attente" },
  ]);

  const [interventionsEnCours, setInterventionsEnCours] = useState([
    { id: 1, titre: "Réparation serveur", client: "Orange", date: "2025-09-08", statut: "En cours", startedAt: new Date() },
  ]);

  const [interventionsTerminees, setInterventionsTerminees] = useState([
    { id: 3, titre: "Installation fibre", client: "Moov", date: "2025-09-05", statut: "Terminé", startedAt: new Date(), endedAt: new Date() },
  ]);

  const [newIntervention, setNewIntervention] = useState({ id: null, titre: "", client: "", date: "", statut: "En attente" });
  const [isEditing, setIsEditing] = useState(false);

  // Tick pour compteur en cours
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const toDate = (isoDate) => (isoDate ? new Date(isoDate + "T00:00:00") : null);

  const applyFilters = (data) => {
    return data.filter((item) => {
      const itemDate = toDate(item.date);
      const startDate = filterStartDate ? toDate(filterStartDate) : null;
      const endDate = filterEndDate ? toDate(filterEndDate) : null;
      const matchesClient = filterClient ? item.client.toLowerCase().includes(filterClient.toLowerCase()) : true;
      const afterStart = startDate ? itemDate >= startDate : true;
      const beforeEnd = endDate ? itemDate <= endDate : true;
      return matchesClient && afterStart && beforeEnd;
    });
  };

  const handleSaveIntervention = () => {
    if (!newIntervention.titre || !newIntervention.client || !newIntervention.date) return;

    if (isEditing && newIntervention.id) {
      if (interventionsEnAttente.some((i) => i.id === newIntervention.id)) {
        setInterventionsEnAttente(prev => prev.map(i => i.id === newIntervention.id ? { ...newIntervention } : i));
      } else if (interventionsEnCours.some((i) => i.id === newIntervention.id)) {
        setInterventionsEnCours(prev => prev.map(i => i.id === newIntervention.id ? { ...newIntervention } : i));
      } else {
        setInterventionsTerminees(prev => prev.map(i => i.id === newIntervention.id ? { ...newIntervention } : i));
      }
    } else {
      const newItem = { ...newIntervention, id: Date.now() };
      if (newItem.statut === "En attente") setInterventionsEnAttente(prev => [...prev, newItem]);
      else if (newItem.statut === "En cours") setInterventionsEnCours(prev => [...prev, { ...newItem, startedAt: new Date() }]);
      else setInterventionsTerminees(prev => [...prev, { ...newItem, startedAt: new Date(), endedAt: new Date() }]);
    }

    setNewIntervention({ id: null, titre: "", client: "", date: "", statut: "En attente" });
    setIsEditing(false);
  };

  const handleDelete = (id, statut) => {
    if (statut === "En attente") setInterventionsEnAttente(prev => prev.filter(i => i.id !== id));
    else if (statut === "En cours") setInterventionsEnCours(prev => prev.filter(i => i.id !== id));
    else setInterventionsTerminees(prev => prev.filter(i => i.id !== id));
  };

  // Démarrer une intervention
  const handleStart = (id) => {
    const item = interventionsEnAttente.find(i => i.id === id);
    if (!item) return;
    setInterventionsEnAttente(prev => prev.filter(i => i.id !== id));
    setInterventionsEnCours(prev => [...prev, { ...item, statut: "En cours", startedAt: new Date() }]);
  };

  // Terminer une intervention
  const handleFinish = (id) => {
    const item = interventionsEnCours.find(i => i.id === id);
    if (!item) return;
    setInterventionsEnCours(prev => prev.filter(i => i.id !== id));
    setInterventionsTerminees(prev => [...prev, { ...item, statut: "Terminé", endedAt: new Date() }]);
  };

  // Réouvrir
  const handleReopen = (id) => {
    const item = interventionsTerminees.find(i => i.id === id);
    if (!item) return;
    setInterventionsTerminees(prev => prev.filter(i => i.id !== id));
    setInterventionsEnCours(prev => [...prev, { ...item, statut: "En cours" }]);
  };

  // Formulaire
  const handleEdit = (item) => {
    setNewIntervention({ ...item });
    setIsEditing(true);
    const offcanvas = document.getElementById("offcanvasAdd");
    if (offcanvas && window.bootstrap) new window.bootstrap.Offcanvas(offcanvas).show();
  };

  const openAdd = () => {
    setNewIntervention({ id: null, titre: "", client: "", date: "", statut: "En attente" });
    setIsEditing(false);
  };

  const resetFilters = () => {
    setFilterClient(""); setFilterStartDate(""); setFilterEndDate("");
  };

  // Utils pour date et durée
  const formatDateTime = (date) => date ? new Date(date).toLocaleString("fr-FR") : "-";
  const formatDuration = (start) => {
    if (!start) return "-";
    const diff = Math.floor((new Date() - new Date(start)) / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2,"0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2,"0");
    const s = String(diff % 60).padStart(2,"0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="intervention-container">
      {/* Onglets */}
      <ul className="nav nav-tabs custom-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="enattente"?"active":""}`} onClick={()=>setActiveTab("enattente")}>
            En attente ({interventionsEnAttente.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="encours"?"active":""}`} onClick={()=>setActiveTab("encours")}>
            En cours ({interventionsEnCours.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab==="termine"?"active":""}`} onClick={()=>setActiveTab("termine")}>
            Terminé ({interventionsTerminees.length})
          </button>
        </li>
      </ul>

      {/* Bouton Ajouter */}
      {activeTab==="enattente" && (
        <div className="btn-container">
          <button className="btn-custom-blue" data-bs-toggle="offcanvas" data-bs-target="#offcanvasAdd" onClick={openAdd}>
            + Ajouter
          </button>
        </div>
      )}

      {/* Filtres pour Terminé */}
      {activeTab==="termine" && (
        <div className="filtre-container">
          <div className="d-flex gap-3 mb-3 mt-3">
            <input type="text" placeholder="Filtrer par client" className="form-control" value={filterClient} onChange={(e)=>setFilterClient(e.target.value)} />
            <input type="date" className="form-control" value={filterStartDate} onChange={(e)=>setFilterStartDate(e.target.value)} />
            <input type="date" className="form-control" value={filterEndDate} onChange={(e)=>setFilterEndDate(e.target.value)} />
            <button className="btn btn-secondary" onClick={resetFilters}>Réinitialiser</button>
          </div>
        </div>
      )}

      {/* Tableaux */}
      <div className="tab-content custom-content">
        {/* En attente */}
        {activeTab==="enattente" && (
          <div>
            <h4>Interventions en attente</h4>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th><th>Titre</th><th>Client</th><th>Date</th><th>Statut</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applyFilters(interventionsEnAttente).map(item=>(
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.titre}</td>
                    <td>{item.client}</td>
                    <td>{item.date}</td>
                    <td><span className="badge status-badge status-en-attente"><i className="bi bi-hourglass-split me-1"/> {item.statut}</span></td>
                    <td>
                      <i className="bi bi-pencil-square text-primary me-2 action-icon" title="Modifier" onClick={()=>handleEdit(item)} />
                      <i className="bi bi-play-circle text-success me-2 action-icon" title="Démarrer" onClick={()=>handleStart(item.id)} />
                      <i className="bi bi-trash-fill text-danger action-icon" title="Supprimer" onClick={()=>handleDelete(item.id,item.statut)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* En cours */}
        {activeTab==="encours" && (
          <div>
            <h4>Interventions en cours</h4>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th><th>Titre</th><th>Client</th><th>Démarrée le</th><th>Durée</th><th>Statut</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interventionsEnCours.map(item=>(
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.titre}</td>
                    <td>{item.client}</td>
                    <td>{formatDateTime(item.startedAt)}</td>
                    <td>{formatDuration(item.startedAt)}</td>
                    <td><span className="badge status-badge status-en-cours"><i className="bi bi-clock-fill me-1"/> {item.statut}</span></td>
                    <td>
                      <i className="bi bi-check-circle text-success me-2 action-icon" title="Terminer" onClick={()=>handleFinish(item.id)} />
                      <i className="bi bi-trash-fill text-danger action-icon" title="Supprimer" onClick={()=>handleDelete(item.id,item.statut)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Terminé */}
        {activeTab==="termine" && (
          <div>
            <h4>Interventions terminées</h4>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th><th>Titre</th><th>Client</th><th>Démarrée le</th><th>Terminée le</th><th>Statut</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applyFilters(interventionsTerminees).map(item=>(
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.titre}</td>
                    <td>{item.client}</td>
                    <td>{formatDateTime(item.startedAt)}</td>
                    <td>{formatDateTime(item.endedAt)}</td>
                    <td><span className="badge status-badge status-termine"><i className="bi bi-check-circle-fill me-1"/> {item.statut}</span></td>
                    <td>
                      <i className="bi bi-arrow-counterclockwise text-warning me-2 action-icon" title="Réouvrir" onClick={()=>handleReopen(item.id)} />
                      <i className="bi bi-trash-fill text-danger action-icon" title="Supprimer" onClick={()=>handleDelete(item.id,item.statut)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Offcanvas Ajouter / Modifier */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasAdd" aria-labelledby="offcanvasAddLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasAddLabel">{isEditing ? "Modifier Intervention" : "Nouvelle Intervention"}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div className="mb-3">
              <label className="form-label">Titre</label>
              <input type="text" className="form-control" value={newIntervention.titre} onChange={(e)=>setNewIntervention({...newIntervention,titre:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Client</label>
              <input type="text" className="form-control" value={newIntervention.client} onChange={(e)=>setNewIntervention({...newIntervention,client:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={newIntervention.date} onChange={(e)=>setNewIntervention({...newIntervention,date:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Statut</label>
              <select className="form-select" value={newIntervention.statut} onChange={(e)=>setNewIntervention({...newIntervention, statut:e.target.value})}>
                <option>En attente</option>
                <option>En cours</option>
                <option>Terminé</option>
              </select>
            </div>
            <button type="button" className="btn btn-success" data-bs-dismiss="offcanvas" onClick={handleSaveIntervention}>
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Interventions;
