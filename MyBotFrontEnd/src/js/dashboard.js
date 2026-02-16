class DashboardManager {
    constructor() {
        this.groups = [];
        this.members = [];
        this.users = [];
    }

    async loadDashboard() {
        if (!auth.isAuthenticated()) {
            window.location.hash = '#home';
            return;
        }

        const dashboardContent = document.getElementById('dashboardContent');
        
        if (auth.isAdmin()) {
            await this.renderAdminDashboard(dashboardContent);
        } else if (auth.isTeacher()) {
            await this.renderTeacherDashboard(dashboardContent);
        }
    }

    async renderAdminDashboard(container) {
        container.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>Groups Management</h3>
                    <button class="btn btn-primary" id="createGroupBtn">Create Group</button>
                    <div id="groupsList" class="dashboard-list"></div>
                </div>
                <div class="dashboard-card">
                    <h3>Members Management</h3>
                    <button class="btn btn-primary" id="createMemberBtn">Add Member</button>
                    <div id="membersList" class="dashboard-list"></div>
                </div>
                <div class="dashboard-card">
                    <h3>Users</h3>
                    <div id="usersList" class="dashboard-list"></div>
                </div>
                <div class="dashboard-card">
                    <h3>🗑️ Recycle Bin</h3>
                    <div id="recycleBin" class="dashboard-list"></div>
                </div>
            </div>
            <div id="modalContainer"></div>
        `;

        await this.loadGroups();
        await this.loadMembers();
        await this.loadUsers();
        this.renderRecycleBin();

        document.getElementById('createGroupBtn')?.addEventListener('click', () => this.showCreateGroupModal());
        document.getElementById('createMemberBtn')?.addEventListener('click', () => this.showCreateMemberModal());
    }

    async renderTeacherDashboard(container) {
        container.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <h3>My Groups</h3>
                    <div id="groupsList" class="dashboard-list"></div>
                </div>
                <div class="dashboard-card">
                    <h3>Schedule</h3>
                    <div id="scheduleView"></div>
                </div>
            </div>
        `;

        await this.loadGroups();
        this.renderSchedule();
    }

    async loadGroups() {
        try {
            const response = await api.getAllGroups();
            if (response.success) {
                this.groups = response.data || [];
                this.renderGroups();
            }
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    }

    renderGroups() {
        const groupsList = document.getElementById('groupsList');
        if (!groupsList) return;

        if (this.groups.length === 0) {
            groupsList.innerHTML = '<p>No groups found</p>';
            return;
        }

        let filteredGroups = this.groups;
        if (auth.isTeacher()) {
            filteredGroups = this.groups.filter(g => g.userId === auth.user.id);
        }

        // Filter out soft-deleted groups for main list
        const activeGroups = filteredGroups.filter(g => !g.isDeleted);

        groupsList.innerHTML = activeGroups.map(group => `
            <div class="list-item">
                <div class="list-item-content">
                    <h4>${this.escapeHtml(group.name)}</h4>
                    <p>${this.escapeHtml(group.description)}</p>
                    <small>${group.startAsHour} - ${group.endAsHour}</small>
                    ${group.user ? `<small>Assigned: ${this.escapeHtml(group.user.displayName || group.user.email)}</small>` : ''}
                </div>
                ${auth.isAdmin() ? `
                    <div class="list-item-actions">
                        <button class="btn btn-sm" onclick="dashboard.editGroup('${group.id}', '${this.escapeJsString(group.name)}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.softDeleteGroup('${this.escapeJsString(group.name)}')">Delete</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    async loadMembers() {
        try {
            const response = await api.getAllMembers();
            if (response.success) {
                this.members = response.data || [];
                this.renderMembers();
            }
        } catch (error) {
            console.error('Error loading members:', error);
        }
    }

    renderMembers() {
        const membersList = document.getElementById('membersList');
        if (!membersList) return;

        if (this.members.length === 0) {
            membersList.innerHTML = '<p>No members found</p>';
            return;
        }

        membersList.innerHTML = this.members.map(member => `
            <div class="list-item">
                <div class="list-item-content">
                    <h4>${this.escapeHtml(member.name)}</h4>
                    <p>${this.escapeHtml(member.description || '')}</p>
                    <small>Status: ${member.status ? '✓ Active' : '✗ Inactive'}</small>
                </div>
                ${auth.isAdmin() ? `
                    <div class="list-item-actions">
                        <button class="btn btn-sm" onclick="dashboard.toggleMemberStatus('${member.id}', ${!member.status})">
                            ${member.status ? 'Deactivate' : 'Activate'}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.deleteMember('${member.id}')">Delete</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    async loadUsers() {
        if (!auth.isAdmin()) return;

        try {
            const response = await api.getAllUsers();
            if (response.success) {
                this.users = response.data || [];
                this.renderUsers();
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    renderUsers() {
        const usersList = document.getElementById('usersList');
        if (!usersList) return;

        if (this.users.length === 0) {
            usersList.innerHTML = '<p>No users found</p>';
            return;
        }

        usersList.innerHTML = this.users.map(user => `
            <div class="list-item">
                <div class="list-item-content">
                    <h4>${this.escapeHtml(user.displayName || user.email)}</h4>
                    <p>${user.email}</p>
                    <small>Role: ${user.role}</small>
                </div>
            </div>
        `).join('');
    }

    renderSchedule() {
        const scheduleView = document.getElementById('scheduleView');
        if (!scheduleView) return;

        const userGroups = this.groups.filter(g => g.userId === auth.user.id);
        
        if (userGroups.length === 0) {
            scheduleView.innerHTML = '<p>No groups assigned</p>';
            return;
        }

        scheduleView.innerHTML = `
            <div class="schedule-grid">
                ${userGroups.map(group => `
                    <div class="schedule-item">
                        <h4>${this.escapeHtml(group.name)}</h4>
                        <p>⏰ ${group.startAsHour} - ${group.endAsHour}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showCreateGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        
        // Get all users who can be assigned (admins and teachers)
        const assignableUsers = this.users.filter(u => u.role === 'admin' || u.role === 'teacher');
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <h2 class="modal-title">Create Group</h2>
                <form id="createGroupForm">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="groupName" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="groupDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Assign Teacher/Admin</label>
                        <select id="groupUserId" required>
                            <option value="">Select User...</option>
                            ${assignableUsers.map(u => `
                                <option value="${u.id}">
                                    ${this.escapeHtml(u.displayName || u.email)} (${u.role})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Start Time</label>
                            <input type="time" id="groupStartTime" required>
                        </div>
                        <div class="form-group">
                            <label>End Time</label>
                            <input type="time" id="groupEndTime" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Create</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('createGroupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createGroup();
            modal.remove();
        });
    }

    async createGroup() {
        const groupData = {
            name: document.getElementById('groupName').value,
            description: document.getElementById('groupDescription').value,
            startAsHour: document.getElementById('groupStartTime').value,
            endAsHour: document.getElementById('groupEndTime').value,
            userId: document.getElementById('groupUserId').value
        };

        try {
            const response = await api.createGroup(groupData);
            if (response.success) {
                await this.loadGroups();
                alert('Group created successfully!');
            }
        } catch (error) {
            alert('Error creating group: ' + error.message);
        }
    }

    showCreateMemberModal() {
        if (this.groups.length === 0) {
            alert('Please create a group first');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <h2 class="modal-title">Add Member</h2>
                <form id="createMemberForm">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="memberName" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="memberDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Group</label>
                        <select id="memberGroup" required>
                            ${this.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Add Member</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('createMemberForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createMember();
            modal.remove();
        });
    }

    async createMember() {
        const memberData = {
            name: document.getElementById('memberName').value,
            description: document.getElementById('memberDescription').value,
            groupId: document.getElementById('memberGroup').value
        };

        try {
            const response = await api.createMember(memberData);
            if (response.success) {
                await this.loadMembers();
                alert('Member added successfully!');
            }
        } catch (error) {
            alert('Error adding member: ' + error.message);
        }
    }

    async deleteGroup(name) {
        if (!confirm(`Delete group "${name}"?`)) return;

        try {
            const response = await api.deleteGroup(name);
            if (response.success) {
                await this.loadGroups();
                alert('Group deleted successfully!');
            }
        } catch (error) {
            alert('Error deleting group: ' + error.message);
        }
    }

    async softDeleteGroup(name) {
        if (!confirm(`Move group "${name}" to recycle bin?`)) return;

        try {
            const response = await api.softDeleteGroup(name);
            if (response.success) {
                await this.loadGroups();
                this.renderRecycleBin();
                alert('Group moved to recycle bin!');
            }
        } catch (error) {
            alert('Error deleting group: ' + error.message);
        }
    }

    editGroup(groupId, groupName) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) {
            alert('Group not found');
            return;
        }

        const assignableUsers = this.users.filter(u => u.role === 'admin' || u.role === 'teacher');
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                <h2 class="modal-title">Edit Group</h2>
                <form id="editGroupForm">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="editGroupName" value="${this.escapeHtml(group.name)}" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="editGroupDescription" required>${this.escapeHtml(group.description)}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Assign Teacher/Admin</label>
                        <select id="editGroupUserId" required>
                            ${assignableUsers.map(u => `
                                <option value="${u.id}" ${u.id === group.userId ? 'selected' : ''}>
                                    ${this.escapeHtml(u.displayName || u.email)} (${u.role})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Start Time</label>
                            <input type="time" id="editGroupStartTime" value="${group.startAsHour}" required>
                        </div>
                        <div class="form-group">
                            <label>End Time</label>
                            <input type="time" id="editGroupEndTime" value="${group.endAsHour}" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Update</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('editGroupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedData = {
                name: document.getElementById('editGroupName').value,
                description: document.getElementById('editGroupDescription').value,
                startAsHour: document.getElementById('editGroupStartTime').value,
                endAsHour: document.getElementById('editGroupEndTime').value,
                userId: document.getElementById('editGroupUserId').value
            };

            try {
                const response = await api.updateGroup(groupName, updatedData);
                if (response.success) {
                    await this.loadGroups();
                    modal.remove();
                    alert('Group updated successfully!');
                }
            } catch (error) {
                alert('Error updating group: ' + error.message);
            }
        });
    }

    renderRecycleBin() {
        const recycleBin = document.getElementById('recycleBin');
        if (!recycleBin) return;

        const deletedGroups = this.groups.filter(g => g.isDeleted);
        const deletedMembers = this.members.filter(m => m.isDeleted);

        if (deletedGroups.length === 0 && deletedMembers.length === 0) {
            recycleBin.innerHTML = '<p style="color: var(--gray);">No deleted items</p>';
            return;
        }

        let html = '';

        if (deletedGroups.length > 0) {
            html += '<h4 style="color: var(--primary); margin-top: 1rem;">Deleted Groups</h4>';
            html += deletedGroups.map(group => `
                <div class="list-item">
                    <div class="list-item-content">
                        <h4 style="text-decoration: line-through;">${this.escapeHtml(group.name)}</h4>
                        <small>Deleted</small>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn btn-sm" onclick="dashboard.restoreGroup('${this.escapeJsString(group.name)}')">Restore</button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.permanentDeleteGroup('${this.escapeJsString(group.name)}')">Delete Forever</button>
                    </div>
                </div>
            `).join('');
        }

        if (deletedMembers.length > 0) {
            html += '<h4 style="color: var(--primary); margin-top: 1rem;">Deleted Members</h4>';
            html += deletedMembers.map(member => `
                <div class="list-item">
                    <div class="list-item-content">
                        <h4 style="text-decoration: line-through;">${this.escapeHtml(member.name)}</h4>
                        <small>Deleted</small>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn btn-sm" onclick="dashboard.restoreMember('${member.id}')">Restore</button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.permanentDeleteMember('${member.id}')">Delete Forever</button>
                    </div>
                </div>
            `).join('');
        }

        recycleBin.innerHTML = html;
    }

    async restoreGroup(name) {
        // Note: You'll need to add a restore endpoint to your API
        alert('Restore functionality requires an API endpoint. Please contact your backend developer to add a restore endpoint.');
    }

    async permanentDeleteGroup(name) {
        if (!confirm(`Permanently delete group "${name}"? This cannot be undone!`)) return;

        try {
            const response = await api.deleteGroup(name);
            if (response.success) {
                await this.loadGroups();
                this.renderRecycleBin();
                alert('Group permanently deleted!');
            }
        } catch (error) {
            alert('Error deleting group: ' + error.message);
        }
    }

    async restoreMember(id) {
        alert('Restore functionality requires an API endpoint. Please contact your backend developer to add a restore endpoint.');
    }

    async permanentDeleteMember(id) {
        if (!confirm('Permanently delete this member? This cannot be undone!')) return;

        try {
            const response = await api.deleteMember(id);
            if (response.success) {
                await this.loadMembers();
                this.renderRecycleBin();
                alert('Member permanently deleted!');
            }
        } catch (error) {
            alert('Error deleting member: ' + error.message);
        }
    }

    async deleteMember(id) {
        if (!confirm('Delete this member?')) return;

        try {
            const response = await api.deleteMember(id);
            if (response.success) {
                await this.loadMembers();
                alert('Member deleted successfully!');
            }
        } catch (error) {
            alert('Error deleting member: ' + error.message);
        }
    }

    async toggleMemberStatus(id, newStatus) {
        try {
            const response = await api.changeMemberStatus(id, newStatus);
            if (response.success) {
                await this.loadMembers();
            }
        } catch (error) {
            alert('Error updating member status: ' + error.message);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeJsString(text) {
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
    }
}

const dashboard = new DashboardManager();