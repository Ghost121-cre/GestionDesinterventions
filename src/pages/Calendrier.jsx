import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

function Calendar() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Mon calendrier</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={[
          { title: "Réunion", date: "2025-08-20" },
          { title: "Formation", date: "2025-08-25" },
        ]}
        dateClick={(info) => alert("Tu as cliqué sur " + info.dateStr)}
      />
    </div>
  )
}

export default Calendar
