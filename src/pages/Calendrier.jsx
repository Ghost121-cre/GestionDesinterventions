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

  const events = interventions.map((i) => ({
    id: i.id,
    title: i.description,
    start: i.datetime || i.startedAt || new Date().toISOString(),
    backgroundColor:
      i.statut === "En attente"
        ? "#cce5ff"
        : i.statut === "En cours"
        ? "#fff3cd"
        : "#d4edda",
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
      />
    </div>
  );
}

export default Calendrier;
