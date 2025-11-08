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

  // Fonction pour normaliser les dates
  const normalizeDate = (dateString) => {
    if (!dateString) return null;

    try {
      // Si c'est déjà une date ISO valide
      if (dateString.includes("T") && dateString.includes(":")) {
        return dateString;
      }

      // Si c'est un format datetime-local (sans fuseau horaire)
      if (dateString.length === 16) {
        return `${dateString}:00`;
      }

      // Si c'est une date simple
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      console.warn("Erreur normalisation date:", dateString, error);
      return null;
    }
  };

  // Fonction pour obtenir la couleur selon le statut
  const getEventColor = (statut, priorite) => {
    switch (statut) {
      case "En attente":
        return "#ffc107"; // Jaune
      case "En cours":
        return "#17a2b8"; // Bleu
      case "Terminé":
        return "#28a745"; // Vert
      default:
        return "#6c757d"; // Gris
    }
  };

  // Préparer les événements pour le calendrier
  const events = interventions
    .filter((i) => i && i.statut !== "Terminé") // Exclure les terminées
    .map((i) => {
      // Prioriser datePlanifiee, puis datetime, puis startedAt
      const dateSource = i.datePlanifiee || i.datetime || i.startedAt;
      const normalizedDate = normalizeDate(dateSource);

      if (!normalizedDate) {
        console.warn("Intervention sans date valide:", i.id, dateSource);
        return null;
      }

      return {
        id: i.id.toString(),
        title: `#${i.id} - ${
          i.description?.substring(0, 50) || "Sans description"
        }${i.description?.length > 50 ? "..." : ""}`,
        start: normalizedDate,
        backgroundColor: getEventColor(i.statut, i.priorite),
        borderColor: getEventColor(i.statut, i.priorite),
        textColor: "#ffffff",
        extendedProps: {
          client: i.client?.nom || `Client #${i.clientId}`,
          produit: i.produit?.nom || `Produit #${i.produitId}`,
          technicien: i.technicien?.prenom
            ? `${i.technicien.prenom} ${i.technicien.nom}`
            : `Technicien #${i.technicienId}`,
          priorite: i.priorite,
          statut: i.statut,
        },
      };
    })
    .filter((event) => event !== null); // Filtrer les événements null

  useEffect(() => {
    // Redimensionner le calendrier quand la sidebar change
    const handleResize = () => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        setTimeout(() => {
          calendarApi.updateSize();
        }, 100);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sidebarWidth, interventions]);

  // Gestionnaire d'événement de clic
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const extendedProps = event.extendedProps;

    alert(
      `Intervention #${event.id}\n` +
        `Client: ${extendedProps.client}\n` +
        `Produit: ${extendedProps.produit}\n` +
        `Technicien: ${extendedProps.technicien}\n` +
        `Statut: ${extendedProps.statut}\n` +
        `Priorité: ${extendedProps.priorite || "Non définie"}\n` +
        `Date: ${
          event.start
            ? new Date(event.start).toLocaleString("fr-FR")
            : "Non planifiée"
        }`
    );
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={false}
        locales={[frLocale]}
        locale="fr"
        height="auto"
        contentHeight="auto"
        expandRows={true}
        dayHeaderFormat={{ weekday: "short", day: "numeric" }}
        headerToolbar={{
          left: "prev,next today",
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
        eventClick={handleEventClick}
        eventDisplay="block"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        nowIndicator={true}
        dayMaxEvents={3}
        views={{
          timeGridWeek: {
            dayHeaderFormat: { weekday: "short", day: "numeric" },
          },
          timeGridDay: {
            dayHeaderFormat: { weekday: "long", day: "numeric", month: "long" },
          },
        }}
        eventContent={(eventInfo) => {
          const timeText = eventInfo.timeText;
          const title = eventInfo.event.title;
          const statut = eventInfo.event.extendedProps.statut;

          return {
            html: `
              <div class="fc-event-content" style="
                padding: 2px 4px;
                font-size: 11px;
                line-height: 1.2;
                white-space: normal;
                overflow: hidden;
                background: ${eventInfo.event.backgroundColor};
                color: ${eventInfo.event.textColor};
                border-radius: 3px;
              ">
                <div style="font-weight: bold; margin-bottom: 2px;">
                  ${timeText ? timeText + " - " : ""}${statut}
                </div>
                <div>${title}</div>
              </div>
            `,
          };
        }}
      />
    </div>
  );
}

export default Calendrier;
