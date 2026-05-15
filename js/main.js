// ============ MAIN APPLICATION ============
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadData();
    initVideoModal();
});

// ============ NAVIGATION ============
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            const tabId = btn.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ============ VIDEO MODAL ============
function initVideoModal() {
    // Create modal element
    const modalHTML = `
        <div class="video-modal-overlay" id="videoModal">
            <div class="video-modal">
                <div class="video-modal-header">
                    <span class="video-modal-title" id="modalTitle">Verification Video</span>
                    <button class="close-modal" id="closeModal">&times;</button>
                </div>
                <div class="video-container" id="videoContainer">
                    <iframe id="videoFrame" src="" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeModal');
    const videoFrame = document.getElementById('videoFrame');

    // Close modal handlers
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        videoFrame.src = ''; // Stop video
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            videoFrame.src = '';
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            videoFrame.src = '';
        }
    });
}

function openVideoModal(videoUrl, levelName) {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const modalTitle = document.getElementById('modalTitle');

    // Convert YouTube URL to embed format if needed
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('watch?v=')) {
        const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    modalTitle.textContent = `Verification: ${levelName}`;
    videoFrame.src = embedUrl;
    modal.classList.add('active');
}

// ============ LOAD DATA ============
async function loadData() {
    try {
        const [listData, recordsData] = await Promise.all([
            fetch('data/list.json').then(r => r.json()),
            fetch('data/records.json').then(r => r.json())
        ]);

        renderLevels(listData);
        renderRecords(recordsData);
        initSearch();
        initVideoButtons();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('levels-container').innerHTML = 
            '<div class="error-message">⚠️ Failed to load levels. Check console for details.</div>';
        document.getElementById('records-container').innerHTML = 
            '<div class="error-message">⚠️ Failed to load records. Check console for details.</div>';
    }
}

// ============ INIT VIDEO BUTTONS ============
function initVideoButtons() {
    document.querySelectorAll('.watch-verification').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoUrl = btn.dataset.video;
            const levelName = btn.dataset.level;
            openVideoModal(videoUrl, levelName);
        });
    });
}

// ============ RENDER LEVELS ============
function renderLevels(levels) {
    const container = document.getElementById('levels-container');

    if (!levels || levels.length === 0) {
        container.innerHTML = '<div class="loading">No levels found.</div>';
        return;
    }

    container.innerHTML = levels.map((level, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';

        return `
            <div class="list-item" data-searchable="${level.name.toLowerCase()} ${level.creator.toLowerCase()} ${level.verifier ? level.verifier.toLowerCase() : ''}">
                <div class="level-header">
                    <span class="level-rank ${rankClass}">#${rank}</span>
                    <div style="flex: 1;">
                        <div class="level-info">
                            <span class="level-name">${escapeHTML(level.name)}</span>
                            ${level.verification ? 
                                `<a href="#" class="verification-badge watch-verification" 
                                    data-video="${escapeHTML(level.verification)}" 
                                    data-level="${escapeHTML(level.name)}">
                                    Verification
                                </a>` 
                                : ''}
                        </div>
                        <div class="level-creator">by ${escapeHTML(level.creator)}${level.verifier ? ` · Verified by ${escapeHTML(level.verifier)}` : ''}</div>
                    </div>
                </div>
                <div class="level-details">
                    ${level.id ? `<span class="detail-item">🔢 ID: ${level.id}</span>` : ''}
                    ${level.difficulty ? `<span class="detail-item">📊 ${escapeHTML(level.difficulty)}</span>` : ''}
                    ${level.length ? `<span class="detail-item">⏱ ${escapeHTML(level.length)}</span>` : ''}
                    ${level.enjoyment ? `<span class="detail-item">⭐ ${level.enjoyment}/10</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ============ RENDER RECORDS ============
function renderRecords(records) {
    const container = document.getElementById('records-container');

    if (!records || records.length === 0) {
        container.innerHTML = '<div class="loading">No records found.</div>';
        return;
    }

    container.innerHTML = records.map(record => {
        return `
            <div class="record-item" data-searchable="${record.player.toLowerCase()} ${record.level.toLowerCase()}">
                <div>
                    <span class="record-player">${escapeHTML(record.player)}</span>
                    ${record.mobile ? '<span class="mobile-badge">📱 Mobile</span>' : ''}
                </div>
                <span class="record-level">${escapeHTML(record.level)}</span>
                <div class="record-details">
                    ${record.progress ? `<span class="detail-item">📈 ${escapeHTML(record.progress)}</span>` : ''}
                    ${record.date ? `<span class="detail-item">📅 ${escapeHTML(record.date)}</span>` : ''}
                    ${record.video ? 
                        `<a href="#" class="record-video watch-verification" 
                            data-video="${escapeHTML(record.video)}" 
                            data-level="${escapeHTML(record.level)}">
                            ▶ Watch
                        </a>` 
                        : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ============ SEARCH FUNCTIONALITY ============
function initSearch() {
    const levelSearch = document.getElementById('level-search');
    const recordSearch = document.getElementById('record-search');

    levelSearch.addEventListener('input', (e) => {
        filterItems('levels-container', e.target.value.toLowerCase());
    });

    recordSearch.addEventListener('input', (e) => {
        filterItems('records-container', e.target.value.toLowerCase());
    });
}

function filterItems(containerId, query) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('.list-item, .record-item');

    items.forEach(item => {
        const searchable = item.dataset.searchable || '';
        if (searchable.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// ============ UTILITIES ============
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
