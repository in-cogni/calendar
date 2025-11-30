using Microsoft.AspNetCore.Mvc;
using CalendarApp.Models;

namespace CalendarApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private static List<CalendarEvent> _events = new List<CalendarEvent>
        {
            new CalendarEvent 
            { 
                Id = 1, 
                Title = "Встреча с командой", 
                Description = "Еженедельная планерка",
                StartDate = DateTime.Today.AddHours(10),
                EndDate = DateTime.Today.AddHours(11),
                Color = "#3788d8"
            },
            new CalendarEvent 
            { 
                Id = 2, 
                Title = "Обед", 
                StartDate = DateTime.Today.AddHours(13),
                EndDate = DateTime.Today.AddHours(14),
                Color = "#ff0000"
            }
        };
        
        private static int _nextId = 3;

        [HttpGet]
        public IActionResult GetEvents()
        {
            return Ok(_events);
        }

        [HttpGet("{id}")]
        public IActionResult GetEvent(int id)
        {
            var calendarEvent = _events.FirstOrDefault(e => e.Id == id);
            if (calendarEvent == null)
                return NotFound();
            
            return Ok(calendarEvent);
        }

        [HttpPost]
        public IActionResult CreateEvent(CalendarEvent calendarEvent)
        {
            calendarEvent.Id = _nextId++;
            _events.Add(calendarEvent);
            return CreatedAtAction(nameof(GetEvent), new { id = calendarEvent.Id }, calendarEvent);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEvent(int id, CalendarEvent calendarEvent)
        {
            var existingEvent = _events.FirstOrDefault(e => e.Id == id);
            if (existingEvent == null)
                return NotFound();

            existingEvent.Title = calendarEvent.Title;
            existingEvent.Description = calendarEvent.Description;
            existingEvent.StartDate = calendarEvent.StartDate;
            existingEvent.EndDate = calendarEvent.EndDate;
            existingEvent.Color = calendarEvent.Color;
            existingEvent.IsAllDay = calendarEvent.IsAllDay;
            existingEvent.Location = calendarEvent.Location;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEvent(int id)
        {
            var calendarEvent = _events.FirstOrDefault(e => e.Id == id);
            if (calendarEvent == null)
                return NotFound();

            _events.Remove(calendarEvent);
            return NoContent();
        }
    }
}