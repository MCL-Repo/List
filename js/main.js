// ============ MAIN APPLICATION ============
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadData();
});

// ============ NAVIGATION ============
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            navButtons.forEach(b => b.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            // Set active
            btn.classList.add('active');
            const tabId = btn.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
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
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('levels-container').innerHTML = 
            '<div class="error-message">⚠️ Failed to load levels. Check console for details.</div>';
        document.getElementById('records-container').innerHTML = 
            '<div class="error-message">⚠️ Failed to load records. Check console for details.</div>';
    }
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
            <div class="list-item" data-searchable="${level.name.toLowerCase()} ${level.creator.toLowerCase()}">
                <div class="level-header">
                    <span class="level-rank ${rankClass}">#${rank}</span>
                    <div>
                        <div class="level-name">${escapeHTML(level.name)}</div>
                        <div class="level-creator">by ${escapeHTML(level.creator)}</div>
                    </div>
                </div>
                <div class="level-details">
                    ${level.id ? `<span class="detail-item">🔢 ID: ${level.id}</span>` : ''}
                    ${level.difficulty ? `<span class="detail-item">📊 ${escapeHTML(level.difficulty)}</span>` : ''}
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
                        `<a href="${escapeHTML(record.video)}" target="_blank" class="record-video">▶ Watch</a>` 
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
