const repoList = document.getElementById('starred-repositories');
const status = document.getElementById('status');

function setStatus(message) {
  if (status) {
    status.textContent = message;
  }
}

function safeText(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }

  const cleaned = value.trim();
  return cleaned || fallback;
}

function renderRepositories(repositories) {
  if (!repoList) {
    return;
  }

  repoList.innerHTML = '';

  if (!Array.isArray(repositories) || repositories.length === 0) {
    const item = document.createElement('li');
    item.className = 'repo-item';
    item.textContent = 'No starred repositories found.';
    repoList.appendChild(item);
    return;
  }

  repositories.forEach((repo) => {
    const item = document.createElement('li');
    item.className = 'repo-item';

    const link = document.createElement('a');
    const name = safeText(repo?.name, 'Untitled repository');
    link.textContent = name;

    const repoUrl = safeText(repo?.url, '');
    if (repoUrl && /^https?:\/\//i.test(repoUrl)) {
      link.href = repoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.href = '#';
      link.setAttribute('aria-disabled', 'true');
      link.tabIndex = -1;
    }

    const description = document.createElement('p');
    description.textContent = safeText(repo?.description, 'No description provided.');

    const meta = document.createElement('div');
    meta.className = 'repo-meta';

    const language = document.createElement('span');
    language.textContent = safeText(repo?.language, 'Unknown');

    const stars = document.createElement('span');
    stars.textContent = `★ ${safeText(String(repo?.stars ?? 0), '0')}`;

    meta.append(language, stars);
    item.append(link, description, meta);
    repoList.appendChild(item);
  });
}

async function loadRepositories() {
  if (!repoList) {
    console.error('The repository list element was not found.');
    return;
  }

  setStatus('Loading starred repositories...');

  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const repositories = await response.json();
    renderRepositories(repositories);

    if (Array.isArray(repositories)) {
      setStatus(`${repositories.length} starred repositories loaded.`);
    } else {
      setStatus('No starred repositories available.');
    }
  } catch (error) {
    repoList.innerHTML = '';
    const item = document.createElement('li');
    item.className = 'repo-item error';
    item.setAttribute('role', 'alert');
    item.textContent = 'Unable to load starred repositories.';
    repoList.appendChild(item);

    setStatus('Unable to load starred repositories.');
    console.error('Could not fetch repository data:', error);
  }
}

loadRepositories();
