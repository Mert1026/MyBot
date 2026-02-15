using Microsoft.EntityFrameworkCore;
using MyBotApi.Data.Models.Models;
using MyBotApi.Data.Repositories.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ApplicationDbContext _context;
        public GroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Group> CreateAsync(Group group)
        {
            _context.Groups.Add(group);
            await _context.SaveChangesAsync();
            return group;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var group = await _context.Groups.FindAsync(id);
            if (group == null)
                return false;

            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoftDeleteAsync(Guid id)
        {
            var group = await _context.Groups.FindAsync(id);
            if (group == null)
                return false;

            await _context.Groups.Where(g => g.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(g => g.IsDeleted, true));
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Group>> GetAllAsync()
        {
            return await _context.Groups
            .ToListAsync();
        }

        public async Task<Group?> GetByIdAsync(Guid id)
        {
            return await _context.Groups
            .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<Group> UpdateAsync(Group group)
        {
            _context.Groups.Update(group);
            await _context.SaveChangesAsync();
            return group;
        }
    }
}
