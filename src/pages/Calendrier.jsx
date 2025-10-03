import React, { useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import "../assets/css/Calendrier.css";
import { useInterventions } from "../context/InterventionContext";

function Calendrier() {
  const { interventions } = useInterventions();
  const { sidebarWidth } = useOutletContext();
  const calendarRef = useRef(null);

  const events = interventions
  .filter((i) => i.statut !== "Terminé") // exclure les terminées
  .map((i) => ({
    id: i.id,
    title: i.description,
    start: i.datetime || i.startedAt || new Date().toISOString(),
    backgroundColor:
      i.statut === "En attente"
        ? "#cce5ff"
        : "#fff3cd", // uniquement attente/en cours
  }));


  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    if (calendarRef.current) {
      setTimeout(() => calendarRef.current.getApi().updateSize(), 300);
    }
  }, [sidebarWidth, interventions]);

  return (
    <div className="calendar-container">

      <FullCalendar
  ref={calendarRef}
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  selectable
  editable
  locales={[frLocale]}
  locale="fr"
  height="1000px"
  expandRows
  dayHeaderContent={(info) => info.text.replace(".", "")}
  aspectRatio={1.5}
  headerToolbar={{
    left: "prev,next",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  }}
  buttonText={{
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
  }}
  events={events}
  eventContent={(arg) => {
  const timeText = arg.timeText; // FullCalendar formate l'heure automatiquement
  const title = arg.event.title;

  return {
    html: `
      <div style="white-space: normal; font-size:12px; line-height:1.2; padding:2px;">
        <strong>${timeText ? timeText + " - " : ""}</strong>${title}
      </div>
    `
  };
}}

/>

    </div>
  );
}

export default Calendrier;
