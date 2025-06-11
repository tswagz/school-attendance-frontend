const studentsData = {
  1: [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" }
  ],
  2: [
    { id: 4, name: "David Lee" },
    { id: 5, name: "Eva Green" },
    { id: 6, name: "Frank Wright" }
  ]
};

document.getElementById('class-select').addEventListener('change', renderStudents);
document.getElementById('submit-btn').addEventListener('click', submitAttendance);
document.getElementById('reset-btn').addEventListener('click', () => renderStudents());

function renderStudents() {
  const classId = document.getElementById('class-select').value;
  const studentList = studentsData[classId] || [];
  const studentListDiv = document.getElementById('student-list');
  studentListDiv.innerHTML = '';

  studentList.forEach((student, index) => {
    const studentDiv = document.createElement('div');
    studentDiv.className = 'student';
    studentDiv.innerHTML = `
      <span>${student.name}</span>
      <select id="status-${student.id}">
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>
    `;
    studentListDiv.appendChild(studentDiv);
  });
}

// Initial render
renderStudents();

function submitAttendance() {
  const classId = document.getElementById('class-select').value;
  const students = studentsData[classId] || [];
  const date = new Date().toISOString().split('T')[0];
  const attendance = students.map(student => {
    const status = document.getElementById(`status-${student.id}`).value;
    return {
      student_id: student.id,
      status
    };
  });

  const payload = {
    class_id: parseInt(classId),
    date,
    attendance
  };

  console.log("Submitting attendance:");
  console.log(JSON.stringify(payload, null, 2));
  alert("Attendance submitted! Check the console for the JSON payload.");
}
