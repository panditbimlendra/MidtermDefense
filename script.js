// Navigation functionality
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
        });

        // Add active class to clicked link
        this.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the selected section
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Detection option cards
document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.option-card').forEach(c => {
            c.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// File upload dropzone
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--primary)';
    this.style.backgroundColor = '#edf3fe';
});

dropZone.addEventListener('dragleave', function() {
    this.style.borderColor = '#dadce0';
    this.style.backgroundColor = '#f8f9fa';
});

dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#dadce0';
    this.style.backgroundColor = '#f8f9fa';
    alert('File ready for analysis: ' + e.dataTransfer.files[0].name);
});