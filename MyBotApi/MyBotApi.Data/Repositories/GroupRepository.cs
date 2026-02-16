using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
            try
            {
                _context.Groups.Add(group);
                await _context.SaveChangesAsync();
                return group;
            }
            catch (Exception ex)
            {
                if(ex.InnerException != null)
                {
                    if (ex.InnerException.ToString().Contains("duplicate"))
                    {
                        throw new Exception("A group with the same name already exists.");
                    }
                    else if (ex.InnerException.ToString().Contains("User"))
                    {
                        throw new Exception("The specified user does not exist.");
                    }
                    else
                    {
                        throw new Exception("An error occurred while creating the group: " + ex.Message);
                    }
                }
                else
                {
                    throw new Exception("An error occurred while creating the group: " + ex.Message);

                }   
            }
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

            group.IsDeleted = true;
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

        public async Task<Group?> GetByNameAsync(string name)
        {
            return await _context.Groups
            .FirstOrDefaultAsync(g => g.Name == name);
        }

        public async Task<Group> UpdateAsync(Group group)
        {
            _context.Groups.Update(group);
            await _context.SaveChangesAsync();
            return group;
        }
    }
}
