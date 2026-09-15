const repoList = document.getElementById('starred-repositories');

async function loadRepositories() {
  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const repositories = await response.json();

    repoList.innerHTML = repositories
      .map(
        (repo) => `
          <li class="repo-item">
            <a href="${repo.url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
            <p>${repo.description}</p>
            <div class="repo-meta">
              <span>${repo.language}</span>
              <span>★ ${repo.stars}</span>
            </div>
          </li>
        `
      )
      .join('');
  } catch (error) {
    repoList.innerHTML = '<li class="repo-item error">Unable to load starred repositories.</li>';
    console.error('Could not fetch repository data:', error);
  }
}

loadRepositories();
