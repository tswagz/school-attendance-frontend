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

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize event listeners if elements exist
    const classSelect = document.getElementById('class-select');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (classSelect) {
        classSelect.addEventListener('change', renderStudents);
        renderStudents(); // Initial render
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAttendance);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => renderStudents());
    }
});

function renderStudents() {
    const classId = document.getElementById('class-select').value;
    const studentList = studentsData[classId] || [];
    const studentListDiv = document.getElementById('student-list');
    
    if (!studentListDiv) return;
    
    studentListDiv.innerHTML = '';

    if (!classId) {
        studentListDiv.innerHTML = '<p class="text-muted">Please select a class to view students.</p>';
        return;
    }

    studentList.forEach((student, index) => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student';
        studentDiv.innerHTML = `
            <span>${student.name}</span>
            <select id="status-${student.id}">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
            </select>
        `;
        studentListDiv.appendChild(studentDiv);
    });
}

function submitAttendance() {
    const classId = document.getElementById('class-select').value;
    
    if (!classId) {
        alert('Please select a class first.');
        return;
    }
    
    const students = studentsData[classId] || [];
    const date = new Date().toISOString().split('T')[0];
    const attendance = students.map(student => {
        const statusElement = document.getElementById(`status-${student.id}`);
        if (!statusElement) {
            console.warn(`Status element not found for student ${student.id}`);
            return null;
        }
        
        const status = statusElement.value;
        return {
            student_id: student.id,
            student_name: student.name,
            status
        };
    }).filter(Boolean); // Remove null entries

    const payload = {
        class_id: parseInt(classId),
        date,
        attendance,
        submitted_by: localStorage.getItem('loggedInUser'),
        submitted_at: new Date().toISOString()
    };

    console.log("Submitting attendance:");
    console.log(JSON.stringify(payload, null, 2));
    
    // Save to localStorage for demo purposes
    const savedAttendance = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    savedAttendance.push(payload);
    localStorage.setItem('attendanceRecords', JSON.stringify(savedAttendance));
    
    // Add to recent activity
    const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    const activityMessage = `Attendance submitted for Class ${classId} on ${date}`;
    recentActivity.unshift(activityMessage);
    
    // Keep only last 5 activities
    if (recentActivity.length > 5) {
        recentActivity.splice(5);
    }
    
    localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
    
    alert("Attendance submitted successfully!");
    
    // Optionally redirect back to dashboard
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
