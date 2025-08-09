// Sample data for the application
const cameraData = [
    {
        id: 1,
        name: "Main Entrance",
        status: "active",
        resolution: "1080p • 30fps",
        statusText: "Live • Motion Detected",
        location: "Front Gate"
    },
    {
        id: 2,
        name: "Parking Lot",
        status: "active",
        resolution: "1080p • 30fps",
        statusText: "Live • Normal",
        location: "West Parking"
    },
    {
        id: 3,
        name: "Server Room",
        status: "warning",
        resolution: "720p • 15fps",
        statusText: "Live • Low Bandwidth",
        location: "Building A"
    },
    {
        id: 4,
        name: "Back Entrance",
        status: "inactive",
        resolution: "-",
        statusText: "Offline • 12 minutes",
        location: "Rear Gate"
    },
    {
        id: 5,
        name: "Lobby",
        status: "active",
        resolution: "720p • 25fps",
        statusText: "Live • Normal",
        location: "Main Building"
    },
    {
        id: 6,
        name: "Warehouse",
        status: "active",
        resolution: "1080p • 20fps",
        statusText: "Live • Normal",
        location: "Building C"
    }
];

const alertData = [
    {
        id: 1,
        type: "critical",
        title: "Unauthorized Access Detected",
        description: "Main Entrance - Person detected after hours",
        time: "2 minutes ago",
        camera: "Camera #1",
        resolved: false
    },
    {
        id: 2,
        type: "warning",
        title: "Motion Detected in Restricted Area",
        description: "Server Room - Unauthorized movement",
        time: "15 minutes ago",
        camera: "Camera #5",
        resolved: false
    },
    {
        id: 3,
        type: "info",
        title: "Camera Offline",
        description: "Back Entrance - Camera disconnected",
        time: "32 minutes ago",
        camera: "Camera #8",
        resolved: false
    },
    {
        id: 4,
        type: "warning",
        title: "Vehicle Detected in Pedestrian Zone",
        description: "East Parking Lot - Alert zone violation",
        time: "1 hour ago",
        camera: "Camera #3",
        resolved: true
    },
    {
        id: 5,
        type: "critical",
        title: "Perimeter Breach",
        description: "North Fence - Motion detected near fence line",
        time: "Just now",
        camera: "Camera #12",
        resolved: false
    }
];

// DOM Elements
const cameraGrid = document.querySelector('.camera-grid');
const cameraGridFull = document.querySelector('.camera-grid-full');
const alertList = document.querySelector('.alert-list');
const alertListFull = document.querySelector('.alert-list-full');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-content');
const dashboardContent = document.getElementById('dashboard');
const searchInput = document.getElementById('search-input');
const overlay = document.getElementById('overlay');
const notificationBell = document.querySelector('.notification-bell');
const notificationCount = document.querySelector('.notification-count');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the application
function init() {
    renderCameras();
    renderAlerts();
    setupEventListeners();
    simulateLiveUpdates();
}

// Render camera cards
function renderCameras() {
    cameraGrid.innerHTML = '';
    cameraGridFull.innerHTML = '';
    
    cameraData.forEach(camera => {
        const cameraCard = createCameraCard(camera);
        cameraGrid.appendChild(cameraCard.cloneNode(true));
        cameraGridFull.appendChild(cameraCard);
    });
}

// Create a camera card element
function createCameraCard(camera) {
    const card = document.createElement('div');
    card.className = 'camera-card';
    card.dataset.id = camera.id;
    
    let statusClass;
    switch(camera.status) {
        case 'active': statusClass = 'status-active'; break;
        case 'inactive': statusClass = 'status-inactive'; break;
        case 'warning': statusClass = 'status-warning'; break;
        default: statusClass = 'status-inactive';
    }
    
    card.innerHTML = `
        <div class="camera-header">
            <div class="camera-name">
                <span class="camera-status ${statusClass}"></span>
                <span>${camera.name}</span>
            </div>
            <div class="camera-actions">
                <button class="expand-btn"><i class="fas fa-expand"></i></button>
                <button><i class="fas fa-cog"></i></button>
            </div>
        </div>
        <div class="camera-feed">
            <div class="camera-placeholder">
                <i class="fas fa-${camera.status === 'inactive' ? 'plug' : 'video'}"></i>
                <span>${camera.status === 'inactive' ? 'Camera Offline' : camera.name + ' Feed'}</span>
            </div>
        </div>
        <div class="camera-footer">
            <span>${camera.resolution}</span>
            <span>${camera.statusText}</span>
        </div>
    `;
    
    return card;
}

// Render alerts
function renderAlerts(filter = 'all') {
    alertList.innerHTML = '';
    alertListFull.innerHTML = '';
    
    const filteredAlerts = filter === 'all' 
        ? alertData 
        : alertData.filter(alert => 
            filter === 'resolved' ? alert.resolved : 
            alert.type === filter && !alert.resolved);
    
    // Only show 3 alerts in dashboard panel
    const dashboardAlerts = filteredAlerts.slice(0, 3);
    
    dashboardAlerts.forEach(alert => {
        const alertItem = createAlertItem(alert);
        alertList.appendChild(alertItem);
    });
    
    filteredAlerts.forEach(alert => {
        const alertItem = createAlertItem(alert, true);
        alertListFull.appendChild(alertItem);
    });
    
    // Update notification count
    const activeAlerts = alertData.filter(alert => !alert.resolved).length;
    notificationCount.textContent = activeAlerts;
}

// Create an alert item element
function createAlertItem(alert, fullView = false) {
    const item = document.createElement('div');
    item.className = 'alert-item';
    item.dataset.id = alert.id;
    
    let iconClass, icon;
    switch(alert.type) {
        case 'critical':
            iconClass = 'alert-critical';
            icon = 'fa-skull';
            break;
        case 'warning':
            iconClass = 'alert-warning';
            icon = 'fa-exclamation-triangle';
            break;
        case 'info':
            iconClass = 'alert-info';
            icon = 'fa-info-circle';
            break;
    }
    
    const resolvedClass = alert.resolved ? 'resolved' : '';
    
    item.innerHTML = `
        <div class="alert-icon-container ${iconClass}">
            <i class="fas ${icon}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-title ${resolvedClass}">${alert.title} ${alert.resolved ? '(Resolved)' : ''}</div>
            <div class="alert-description">${alert.description}</div>
            <div class="alert-time">${alert.time} • ${alert.camera}</div>
        </div>
    `;
    
    if (fullView) {
        item.addEventListener('click', () => {
            markAlertAsResolved(alert.id);
        });
    }
    
    return item;
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show the corresponding page
            const target = item.dataset.target;
            pages.forEach(page => page.style.display = 'none');
            dashboardContent.style.display = 'none';
            
            if (target === 'dashboard') {
                dashboardContent.style.display = 'block';
            } else {
                document.getElementById(target).style.display = 'block';
            }
        });
    });
    
    // Camera expand buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('expand-btn') || 
            e.target.parentElement.classList.contains('expand-btn')) {
            const cameraCard = e.target.closest('.camera-card');
            const cameraId = cameraCard.dataset.id;
            expandCameraView(cameraId);
        }
    });
    
    // Close expanded view
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn') || 
            e.target.classList.contains('overlay')) {
            closeExpandedView();
        }
    });
    
    // Alert filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderAlerts(button.textContent.toLowerCase());
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        cameraData.forEach(camera => {
            const cameraElement = document.querySelector(`.camera-card[data-id="${camera.id}"]`);
            if (cameraElement) {
                const matches = camera.name.toLowerCase().includes(searchTerm) || 
                              camera.location.toLowerCase().includes(searchTerm);
                cameraElement.style.display = matches ? 'block' : 'none';
            }
        });
    });
    
    // Notification bell
    notificationBell.addEventListener('click', () => {
        // Navigate to alerts page
        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-item[data-target="alerts"]').classList.add('active');
        
        pages.forEach(page => page.style.display = 'none');
        document.getElementById('alerts').style.display = 'block';
    });
}

// Expand camera view
function expandCameraView(cameraId) {
    const camera = cameraData.find(c => c.id == cameraId);
    if (!camera) return;
    
    // Create expanded view
    const expandedView = document.createElement('div');
    expandedView.className = 'expanded-camera';
    expandedView.innerHTML = `
        <div class="expanded-header">
            <div class="camera-name">
                <span class="camera-status status-${camera.status}"></span>
                <span>${camera.name} - Expanded View</span>
            </div>
            <button class="close-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="expanded-feed">
            <div class="camera-placeholder">
                <i class="fas fa-${camera.status === 'inactive' ? 'plug' : 'video'} fa-3x"></i>
                <span>${camera.status === 'inactive' ? 'Camera Offline' : camera.name + ' Feed'}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(expandedView);
    overlay.style.display = 'block';
    expandedView.style.display = 'block';
}

// Close expanded view
function closeExpandedView() {
    const expandedView = document.querySelector('.expanded-camera');
    if (expandedView) {
        expandedView.remove();
    }
    overlay.style.display = 'none';
}

// Mark alert as resolved
function markAlertAsResolved(alertId) {
    const alert = alertData.find(a => a.id == alertId);
    if (alert) {
        alert.resolved = true;
        renderAlerts(document.querySelector('.filter-btn.active').textContent.toLowerCase());
    }
}

// Simulate live updates
function simulateLiveUpdates() {
    setInterval(() => {
        // Randomly add a new alert occasionally
        if (Math.random() > 0.7) {
            const newAlert = {
                id: alertData.length + 1,
                type: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'warning' : 'info',
                title: `Security Event ${Math.floor(Math.random() * 1000)}`,
                description: `Detected activity at location ${Math.floor(Math.random() * 20)}`,
                time: "Just now",
                camera: `Camera #${Math.floor(Math.random() * 20)}`,
                resolved: false
            };
            
            alertData.unshift(newAlert);
            renderAlerts();
        }
        
        // Randomly resolve an alert
        if (Math.random() > 0.8 && alertData.some(a => !a.resolved)) {
            const unresolvedAlerts = alertData.filter(a => !a.resolved);
            if (unresolvedAlerts.length > 0) {
                const randomAlert = unresolvedAlerts[Math.floor(Math.random() * unresolvedAlerts.length)];
                randomAlert.resolved = true;
                renderAlerts();
            }
        }
        
        // Randomly change camera status
        if (Math.random() > 0.9) {
            const randomCamera = cameraData[Math.floor(Math.random() * cameraData.length)];
            const statuses = ['active', 'inactive', 'warning'];
            randomCamera.status = statuses[Math.floor(Math.random() * statuses.length)];
            
            if (randomCamera.status === 'inactive') {
                randomCamera.statusText = `Offline • ${Math.floor(Math.random() * 60)} minutes`;
            } else if (randomCamera.status === 'warning') {
                randomCamera.statusText = 'Live • Low Bandwidth';
            } else {
                randomCamera.statusText = Math.random() > 0.5 ? 'Live • Normal' : 'Live • Motion Detected';
            }
            
            renderCameras();
        }
    }, 5000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);