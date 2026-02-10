// デフォルトのリンクデータ
const defaultLinks = [
    {
        category: "開発ツール",
        title: "GitHub",
        url: "https://github.com",
        description: "コード管理プラットフォーム"
    },
    {
        category: "開発ツール",
        title: "Stack Overflow",
        url: "https://stackoverflow.com",
        description: "プログラミング質問サイト"
    },
    {
        category: "学習",
        title: "Udemy",
        url: "https://www.udemy.com",
        description: "オンライン学習プラットフォーム"
    },
    {
        category: "学習",
        title: "Codecademy",
        url: "https://www.codecademy.com",
        description: "インタラクティブなプログラミング学習"
    },
    {
        category: "生産性",
        title: "Notion",
        url: "https://www.notion.so",
        description: "ドキュメント管理ツール"
    },
    {
        category: "生産性",
        title: "Trello",
        url: "https://trello.com",
        description: "タスク管理ツール"
    }
];

// ローカルストレージからリンクを読み込む
function loadLinks() {
    const stored = localStorage.getItem('links');
    return stored ? JSON.parse(stored) : defaultLinks;
}

// ローカルストレージにリンクを保存
function saveLinks(links) {
    localStorage.setItem('links', JSON.stringify(links));
}

// リンクを表示
function renderLinks(links = null) {
    const allLinks = links || loadLinks();
    const container = document.getElementById('linkContainer');

    if (allLinks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 まだリンクがありません</p>
                <p>下のフォームからリンクを追加してみてください！</p>
            </div>
        `;
        return;
    }

    // カテゴリごとにグループ化
    const groupedLinks = {};
    allLinks.forEach(link => {
        if (!groupedLinks[link.category]) {
            groupedLinks[link.category] = [];
        }
        groupedLinks[link.category].push(link);
    });

    // HTMLを生成
    let html = '';
    Object.keys(groupedLinks).sort().forEach(category => {
        html += `
            <section class="category-section">
                <h2 class="category-title">📂 ${category}</h2>
                <div class="links-grid">
                    ${groupedLinks[category].map((link, index) => `
                        <div class="link-card">
                            <div class="link-title">${escapeHtml(link.title)}</div>
                            <div class="link-description">${escapeHtml(link.description || '説明なし')}</div>
                            <div class="link-url">${escapeHtml(link.url)}</div>
                            <div class="link-actions">
                                <button class="btn-open" onclick="openLink('${escapeAttribute(link.url)}')">
                                    新規タブで開く →
                                </button>
                                <button class="btn-delete" onclick="deleteLink('${escapeAttribute(category)}', ${index})">
                                    削除
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    });

    container.innerHTML = html;
}

// リンクを新規タブで開く
function openLink(url) {
    window.open(url, '_blank');
}

// リンクを削除
function deleteLink(category, index) {
    if (confirm(`このリンクを削除してもよろしいですか？`)) {
        const links = loadLinks();
        const categoryLinks = links.filter(l => l.category === category);
        
        if (confirm('本当に削除しますか？')) {
            const linkToDelete = categoryLinks[index];
            const newLinks = links.filter(link => 
                !(link.category === category && 
                  link.title === linkToDelete.title && 
                  link.url === linkToDelete.url)
            );
            saveLinks(newLinks);
            renderLinks(newLinks);
        }
    }
}

// HTML特殊文字をエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 属性値用エスケープ
function escapeAttribute(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// フォーム送信時の処理
document.getElementById('addLinkForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const category = document.getElementById('category').value.trim();
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();
    const description = document.getElementById('description').value.trim();

    if (category && title && url) {
        const links = loadLinks();
        links.push({
            category,
            title,
            url,
            description
        });
        saveLinks(links);
        renderLinks(links);

        // フォームをリセット
        this.reset();
        alert('リンクを追加しました！');
    }
});

// 検索機能
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const allLinks = loadLinks();

    if (searchTerm === '') {
        renderLinks(allLinks);
        return;
    }

    const filtered = allLinks.filter(link =>
        link.title.toLowerCase().includes(searchTerm) ||
        link.category.toLowerCase().includes(searchTerm) ||
        link.description.toLowerCase().includes(searchTerm) ||
        link.url.toLowerCase().includes(searchTerm)
    );

    renderLinks(filtered);
});

// ページロード時にリンクを表示
document.addEventListener('DOMContentLoaded', function() {
    renderLinks();
});