const githubApiUrl = 'https://api.github.com/repos/Etan31/UNO-offline-game/contributors';
async function loadContributors() {
  try {
    // Fetch contributors from GitHub API
    const response = await fetch(githubApiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch contributors: ${response.status}`);
    }

    const contributors = await response.json();

    // Select the <ul> element to display the contributors
    const contributorList = document.querySelector('.contributor-name');

    // Skip the first contributor and iterate over the rest
    contributors.slice(1).forEach(contributor => {
      const listItem = document.createElement('li');
      listItem.classList.add('dev-name'); 

      // Add a link to the contributor's GitHub profile
      const link = document.createElement('a');
      link.href = contributor.html_url;
      link.textContent = contributor.login; // GitHub username
      link.target = '_blank'; // Open link in a new tab

      // Append the link to the list item
      listItem.appendChild(link);

      // Append the list item to the <ul>
      contributorList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error loading contributors:', error);
  }
}

// Load contributors on page load
document.addEventListener('DOMContentLoaded', loadContributors);