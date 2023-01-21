/* global FullCalendar */

/**
 * --------------------------------------------------------------------------
 * CoreUI Boostrap Admin Template (4.3.0): calendar.js
 * License (https://coreui.io/pro/license)
 * --------------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
		const calendar = new FullCalendar.Calendar(calendarEl, {
			themeSystem: "bootstrap",
			initialView: "dayGridMonth",
			initialDate: new Date(),
			headerToolbar: {
				left: "prev,next,today",
				center: "title",
				right: "dayGridMonth,timeGridWeek,timeGridDay"
			},
			editable: true,
			selectable: true,
			businessHours: true,
			dayMaxEvents: true,
			select: function(info){
				document.getElementById('activity_start').value = info.dateStr;
				$('#addActivity').modal('show')
			},
			events: function(){
				// return axios.get('/activities')
				// .then(response =>{
				// 	return response.data;
				// })
			}
		});
    calendar.render();
  });