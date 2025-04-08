document.addEventListener('DOMContentLoaded', async function() {
    const timeline = document.querySelector('.timeline');
    timeline.innerHTML = '<div class="loading">Loading committee data...</div>';

    try {
        // 1. Auto-discover available years by testing likely filenames
        const availableYears = await discoverYearFiles();
        
        // 2. Sort years descending (newest first)
        const sortedYears = availableYears.sort((a, b) => {
            const yearA = parseInt(a.split('-')[0]);
            const yearB = parseInt(b.split('-')[0]);
            return yearB - yearA; // Newest first
        });

        // 3. Load all year data in parallel (faster than sequential)
        const yearData = await Promise.all( 
            sortedYears.map(year => 
                loadYearData(year).catch(e => {
                    console.warn(`Skipping ${year}.json (failed to load)`);
                    return null;
                })
            )
        );

        // 4. Display only successfully loaded years
        yearData.filter(data => data).forEach(data => createYearRow(data));
        
        timeline.querySelector('.loading')?.remove();
    } catch (error) {
        console.error('Error:', error);
        timeline.innerHTML = `
            <div class="error">
                Error loading data. 
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    setupModal();
});

/**
 * Tries to find all available year files by testing likely patterns
 */
async function discoverYearFiles() {
    const currentYear = new Date().getFullYear();
    const testYears = [];
    
    // Generate likely academic year patterns (e.g., 2023-2024)
    for (let i = currentYear + 1; i >= currentYear - 10; i--) {
        testYears.push(`${i-1}-${i}`); // Academic years
    }
    
    // Test which files actually exist
    const existenceChecks = await Promise.all(
        testYears.map(year => 
            fetch(`data/${year}.json`)
                .then(r => r.ok ? year : null)
                .catch(() => null)
        )
    );
    
    return existenceChecks.filter(year => year !== null);
}

/**
 * Loads data for a specific year
 */
async function loadYearData(year) {
    const response = await fetch(`data/${year}.json`);
    if (!response.ok) throw new Error(`${year}.json not found`);
    const data = await response.json();
    data.year = year; // Ensure year is set
    return data;
}

/**
 * Creates a timeline row for a year's committee
 */
function createYearRow(yearData) {
    const timeline = document.querySelector('.timeline');
    
    const yearRow = document.createElement('div');
    yearRow.className = 'year-row';
    
    const yearHeader = document.createElement('div');
    yearHeader.className = 'year-header';
    yearHeader.innerHTML = yearData.year + (yearData.current ? '<br>(Current)' : '');
    
    const committeeRow = document.createElement('div');
    committeeRow.className = 'committee-row';
    
    // Sort members by role importance (optional)
    const roleOrder = ['President', 'Vice President', 'Secretary', 'Treasurer'];
    const sortedMembers = [...yearData.members].sort((a, b) => {
        const aIndex = roleOrder.indexOf(a.role);
        const bIndex = roleOrder.indexOf(b.role);
        return (aIndex > -1 ? aIndex : Infinity) - (bIndex > -1 ? bIndex : Infinity);
    });
    
    sortedMembers.forEach(member => {
        const memberBox = document.createElement('div');
        memberBox.className = `committee-box ${member.type}`;
        memberBox.innerHTML = `
            <div class="name">${member.name}</div>
            <div class="role">${member.role}</div>
        `;
        
        // Set data attributes for modal
        memberBox.dataset.name = member.name;
        memberBox.dataset.role = member.role;
        memberBox.dataset.bio = member.bio || '';
        if (member.links) {
            memberBox.dataset.links = member.links.map(l => `${l.platform}:${l.username}`).join(', ');
        }
        
        committeeRow.appendChild(memberBox);
    });
    
    yearRow.appendChild(yearHeader);
    yearRow.appendChild(committeeRow);
    timeline.appendChild(yearRow);
}

/**
 * Sets up the member modal functionality
 */
function setupModal() {
    const modal = document.getElementById('memberModal');
    const closeBtn = document.querySelector('.close');
    
    // Handle clicks on committee members
    document.addEventListener('click', (e) => {
        const box = e.target.closest('.committee-box');
        if (!box) return;
        
        // Update modal content
        document.getElementById('modalName').textContent = box.dataset.name;
        document.getElementById('modalRole').textContent = box.dataset.role;
        document.getElementById('modalBio').textContent = box.dataset.bio;
        
        // Generate links
        const linksContainer = document.getElementById('modalLinks');
        linksContainer.innerHTML = '';
        
        if (box.dataset.links) {
            box.dataset.links.split(', ').forEach(link => {
                const [platform, username] = link.split(':');
                const a = document.createElement('a');
                a.textContent = platform;
                a.target = '_blank';
                a.className = 'modal-link';
                
                // Set appropriate URL based on platform
                const platforms = {
                    linkedin: `https://linkedin.com/in/${username}`,
                    github: `https://github.com/${username}`,
                    twitter: `https://twitter.com/${username}`,
                    email: `mailto:${username}`,
                    website: username.startsWith('http') ? username : `https://${username}`
                };
                
                a.href = platforms[platform] || `https://${username}`;
                linksContainer.appendChild(a);
            });
        }
        
        modal.style.display = 'block';
    });
    
    // Close modal handlers
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => e.target === modal && (modal.style.display = 'none'));
}