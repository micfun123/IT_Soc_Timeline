document.addEventListener('DOMContentLoaded', function() {
    // Years to load
    const years = ['2024-2025', '2023-2024', '2022-2023'];
    
    // Load each year's data
    years.forEach(year => {
        fetch(`data/${year}.json`)
            .then(response => response.json())
            .then(data => {
                createYearRow(data);
            })
            .catch(error => {
                console.error(`Error loading ${year} data:`, error);
            });
    });

    // Setup modal functionality
    setupModal();
});

function createYearRow(yearData) {
    const timeline = document.querySelector('.timeline');
    
    const yearRow = document.createElement('div');
    yearRow.className = 'year-row';
    
    const yearHeader = document.createElement('div');
    yearHeader.className = 'year-header';
    yearHeader.innerHTML = yearData.year + (yearData.current ? '<br>(Current)' : '');
    
    const committeeRow = document.createElement('div');
    committeeRow.className = 'committee-row';
    
    yearData.members.forEach(member => {
        const memberBox = document.createElement('div');
        memberBox.className = `committee-box ${member.type}`;
        
        // Set data attributes
        memberBox.setAttribute('data-name', member.name);
        memberBox.setAttribute('data-role', member.role);
        memberBox.setAttribute('data-bio', member.bio);
        
        // Format links as comma-separated string if they exist
        if (member.links && member.links.length > 0) {
            const linksStr = member.links.map(link => `${link.platform}:${link.username}`).join(', ');
            memberBox.setAttribute('data-links', linksStr);
        }
        
        // Create name and role elements
        const nameElement = document.createElement('div');
        nameElement.className = 'name';
        nameElement.textContent = member.name;
        
        const roleElement = document.createElement('div');
        roleElement.className = 'role';
        roleElement.textContent = member.role;
        
        memberBox.appendChild(nameElement);
        memberBox.appendChild(roleElement);
        
        committeeRow.appendChild(memberBox);
    });
    
    yearRow.appendChild(yearHeader);
    yearRow.appendChild(committeeRow);
    timeline.appendChild(yearRow);
}

function setupModal() {
    const modal = document.getElementById('memberModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const committeeBoxes = document.querySelectorAll('.committee-box');
    
    // When the user clicks on a committee box, open the modal
    document.addEventListener('click', function(event) {
        const box = event.target.closest('.committee-box');
        if (box) {
            const name = box.getAttribute('data-name');
            const role = box.getAttribute('data-role');
            const bio = box.getAttribute('data-bio');
            const links = box.getAttribute('data-links');
            
            document.getElementById('modalName').textContent = name;
            document.getElementById('modalRole').textContent = role;
            document.getElementById('modalBio').textContent = bio;
            
            // Generate links
            const linksContainer = document.getElementById('modalLinks');
            linksContainer.innerHTML = '';
            
            if (links) {
                const linkArray = links.split(', ');
                linkArray.forEach(link => {
                    const [platform, username] = link.split(':');
                    const linkElement = document.createElement('a');
                    
                    // Same link generation logic as before
                    switch(platform) {
                        case 'linkedin':
                            linkElement.textContent = 'LinkedIn';
                            linkElement.href = `https://linkedin.com/in/${username}`;
                            break;
                        case 'github':
                            linkElement.textContent = 'GitHub';
                            linkElement.href = `https://github.com/${username}`;
                            break;
                        case 'website':
                            linkElement.textContent = 'Website';
                            linkElement.href = `https://${username}`;
                            break;
                        case 'twitter':
                            linkElement.textContent = 'Twitter';
                            linkElement.href = `https://twitter.com/${username}`;
                            break;
                        case 'instagram':
                            linkElement.textContent = 'Instagram';
                            linkElement.href = `https://instagram.com/${username}`;
                            break;
                        case 'mastodon':
                            linkElement.textContent = 'Mastodon';
                            linkElement.href = `https://mastodon.social/@${username}`;
                            break;
                        case 'email':
                            linkElement.textContent = 'Email';
                            linkElement.href = `mailto:${username}`;
                            break;
                        case 'youtube':
                            linkElement.textContent = 'YouTube';
                            linkElement.href = `https://youtube.com/${username}`;
                            break;
                        default:
                            linkElement.textContent = platform;
                            linkElement.href = `https://${username}`;
                    }
                    
                    linkElement.target = "_blank";
                    linksContainer.appendChild(linkElement);
                });
            }
            
            modal.style.display = 'block';
        }
    });
    
    // Close the modal when the user clicks on the close button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}