import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import frLocale from "@fullcalendar/core/locales/fr"
import "../assets/css/Calendrier.css"



function Calendar() {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        locales={[frLocale]}
        locale="fr"
        height="1000px"
        expandRows={true}
        dayHeaderContent={info => info.text.replace('.', '')}
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
        events={[
          { title: "Conférence", date: "2025-08-20", color: "#ff6b6b" },
          { title: "Réunion", date: "2025-08-21", color: "#1dd1a1" },
          { title: "Atelier", date: "2025-08-22", color: "#54a0ff" },
        ]}
      />
    </div>
  )
}

export default Calendar
