const timeInForm = document.getElementById("time-in-form");
const timeOutForm = document.getElementById("time-out-form");
const attendanceStatusText = document.getElementById("attendance-status-text");
const attendanceStatusDot = document.getElementById("attendance-status-dot");
const attendanceTimeIn = document.getElementById("attendance-time-in");
const attendanceTimeOut = document.getElementById("attendance-time-out");
const attendanceTotalHours = document.getElementById("attendance-total-hours");

function showToast(message, type = "success") {
  const styles = {
    success: {
      card: "bg-green-50 border-green-200",
      text: "text-green-700",
      icon: "bg-green-500",
      path: '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />',
    },
    error: {
      card: "bg-red-50 border-red-200",
      text: "text-red-700",
      icon: "bg-red-500",
      path: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />',
    },
  };

  const style = styles[type] ?? styles.success;

  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 flex items-center gap-2 rounded-lg border ${style.card} px-4 py-2.5 shadow-sm z-50 animate-fadeIn`;
  toast.innerHTML = `
    <span class="flex h-5 w-5 items-center justify-center rounded-full ${style.icon}">
      <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${style.path}</svg>
    </span>
    <span class="text-sm font-medium ${style.text}">${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("animate-fadeOut");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

timeInForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = timeInForm.querySelector("button");
  button.disabled = true;
  button.textContent = "Recording...";

  try {
    const response = await fetch(timeInForm.action, {
      method: "POST",
      body: new FormData(timeInForm),
      headers: { "Accept": "application/json" },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showToast(data.message ?? "Failed to record time in.", "error");
      button.disabled = false;
      button.innerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>Time In`;
      return;
    }

    const attendance = data.attendance;

    if (attendance.time_in) {
      attendanceTimeIn.textContent = formatTime(new Date(attendance.time_in));
    }

    attendanceStatusText.textContent = "Working";
    attendanceStatusDot.classList.remove("bg-gray-400", "bg-green-500");
    attendanceStatusDot.classList.add("bg-cyan-500");

    const actionDiv = timeInForm.closest(".flex");
    timeInForm.remove();

    const timeOutBtn = document.createElement("form");
    timeOutBtn.method = "POST";
    timeOutBtn.action = "/employee/attendance/time-out";
    timeOutBtn.id = "time-out-form";
    timeOutBtn.className = "w-full lg:w-auto";
    timeOutBtn.innerHTML = `
      <input type="hidden" name="_token" value="${document.querySelector('input[name="_token"]').value}">
      <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 lg:w-auto">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 7l-5 5 5 5M5 12h10"/>
        </svg>
        Time Out
      </button>
    `;
    actionDiv.appendChild(timeOutBtn);

    const newTimeOutForm = document.getElementById("time-out-form");
    newTimeOutForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = newTimeOutForm.querySelector("button");
      button.disabled = true;
      button.textContent = "Recording...";

      try {
        const response = await fetch(newTimeOutForm.action, {
          method: "POST",
          body: new FormData(newTimeOutForm),
          headers: { "Accept": "application/json" },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          showToast(data.message ?? "Failed to record time out.", "error");
          button.disabled = false;
          button.innerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 7l-5 5 5 5M5 12h10"/></svg>Time Out`;
          return;
        }

        const attendance = data.attendance;

        if (attendance.time_out) {
          attendanceTimeOut.textContent = formatTime(new Date(attendance.time_out));
        }

        attendanceStatusText.textContent = "Completed";
        attendanceStatusDot.classList.remove("bg-cyan-500", "bg-gray-400");
        attendanceStatusDot.classList.add("bg-green-500");

        if (attendance.time_in && attendance.time_out) {
          const timeIn = new Date(attendance.time_in);
          const timeOut = new Date(attendance.time_out);
          const difference = timeOut.getTime() - timeIn.getTime();
          const totalMinutes = Math.floor(difference / 60000);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          attendanceTotalHours.textContent = `${hours}h ${String(minutes).padStart(2, "0")}m`;
        }

        const actionDiv = newTimeOutForm.closest(".flex");
        newTimeOutForm.remove();

        const completeDiv = document.createElement("div");
        completeDiv.className = "flex items-center justify-center px-2 text-center";
        completeDiv.innerHTML = '<p class="text-sm text-gray-500">Your attendance for today is complete.</p>';
        actionDiv.appendChild(completeDiv);

        showToast(data.message);
      } catch (error) {
        console.error(error);
        showToast("Something went wrong while recording time out.", "error");
        button.disabled = false;
        button.innerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 7l-5 5 5 5M5 12h10"/></svg>Time Out`;
      }
    });

    showToast(data.message);
  } catch (error) {
    console.error(error);
    showToast("Something went wrong while recording time in.", "error");
    button.disabled = false;
    button.innerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>Time In`;
  }
});

timeOutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = timeOutForm.querySelector("button");
  button.disabled = true;
  button.textContent = "Recording...";

  try {
    const response = await fetch(timeOutForm.action, {
      method: "POST",
      body: new FormData(timeOutForm),
      headers: { "Accept": "application/json" },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showToast(data.message ?? "Failed to record time out.", "error");
      button.disabled = false;
      button.innerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 7l-5 5 5 5M5 12h10" /></svg>Time Out`;
      return;
    }

    const attendance = data.attendance;

    if (attendance.time_out) {
      attendanceTimeOut.textContent = formatTime(new Date(attendance.time_out));
    }

    attendanceStatusText.textContent = "Completed";
    attendanceStatusDot.classList.remove("bg-cyan-500", "bg-gray-400");
    attendanceStatusDot.classList.add("bg-green-500");

    if (attendance.time_in && attendance.time_out) {
      const timeIn = new Date(attendance.time_in);
      const timeOut = new Date(attendance.time_out);
      const difference = timeOut.getTime() - timeIn.getTime();
      const totalMinutes = Math.floor(difference / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      attendanceTotalHours.textContent = `${hours}h ${String(minutes).padStart(2, "0")}m`;
    }

    timeOutForm.remove();
    const completeMsg = document.getElementById("attendance-complete-message");
    if (completeMsg) {
      completeMsg.style.display = "flex";
    }
    showToast(data.message);
  } catch (error) {
    console.error(error);
    showToast("Something went wrong while recording time out.", "error");
    button.disabled = false;
    button.innerHTML = `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 7l-5 5 5 5M5 12h10" /></svg>Time Out`;
  }
});

function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
