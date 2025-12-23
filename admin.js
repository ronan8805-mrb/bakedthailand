// Admin Logic - admin.js

function renderMembers() {
    const members = JSON.parse(localStorage.getItem('baked_members') || '[]');
    const memberList = document.getElementById('admin-member-list');

    memberList.innerHTML = members.map(m => `
        <tr>
            <td><strong>${m.memberId}</strong></td>
            <td>${m.name}</td>
            <td>${m.email}</td>
            <td><span style="color:${m.status === 'Approved' ? 'green' : 'orange'}">${m.status}</span></td>
            <td>
                ${m.status === 'Pending' ? `<button class="btn-approve" onclick="updateMemberStatus('${m.email}', 'Approved')">Approve</button>` : ''}
                <button class="btn-reject" onclick="deleteMember('${m.email}')">Remove</button>
            </td>
        </tr>
    `).join('');
}

function updateMemberStatus(email, status) {
    let members = JSON.parse(localStorage.getItem('baked_members') || '[]');
    members = members.map(m => {
        if (m.email === email) {
            m.status = status;
        }
        return m;
    });
    localStorage.setItem('baked_members', JSON.stringify(members));
    renderMembers();
}

function deleteMember(email) {
    if (confirm('Are you sure you want to remove this member?')) {
        let members = JSON.parse(localStorage.getItem('baked_members') || '[]');
        members = members.filter(m => m.email !== email);
        localStorage.setItem('baked_members', JSON.stringify(members));
        renderMembers();
    }
}

function renderAllOrders() {
    const members = JSON.parse(localStorage.getItem('baked_members') || '[]');
    const orderList = document.getElementById('admin-order-list');
    let allOrders = [];

    members.forEach(m => {
        if (m.purchases) {
            m.purchases.forEach(order => {
                allOrders.push({ ...order, memberId: m.memberId });
            });
        }
    });

    // Sort by date (newest first)
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    orderList.innerHTML = allOrders.map(o => `
        <tr>
            <td>${o.memberId}</td>
            <td>${o.date}</td>
            <td>${o.items}</td>
            <td>THB ${o.total}</td>
            <td><span class="source-tag tag-${o.source}">${o.source}</span></td>
        </tr>
    `).join('');
}

// Handling new order submission from Modal
if (document.getElementById('new-order-form')) {
    document.getElementById('new-order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const mid = document.getElementById('order-member-id').value;
        const items = document.getElementById('order-items').value;
        const total = document.getElementById('order-total').value;

        let members = JSON.parse(localStorage.getItem('baked_members') || '[]');
        const memberIndex = members.findIndex(m => m.memberId === mid);

        if (memberIndex === -1) {
            alert('Member ID not found!');
            return;
        }

        const newOrder = {
            orderId: Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString(),
            items: items,
            total: total,
            source: 'shop'
        };

        if (!members[memberIndex].purchases) members[memberIndex].purchases = [];
        members[memberIndex].purchases.push(newOrder);

        localStorage.setItem('baked_members', JSON.stringify(members));
        alert('Order assigned successfully!');

        // Update dashboard if currently logged in as that user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.memberId === mid) {
            localStorage.setItem('currentUser', JSON.stringify(members[memberIndex]));
        }

        closeOrderModal();
        renderAllOrders();
    });
}
