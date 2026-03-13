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
                        throw new Exception("An error occurred while creating the group: " + ex.InnerException?.Message ?? ex.Message);
                    }
                }
                else
                {
                    throw new Exception("An error occurred while creating the group: " + ex.InnerException?.Message ?? ex.Message);

                }   
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            try
            {
                var group = await _context.Groups.FindAsync(id);
                if (group == null)
                    return false;

                _context.Groups.Remove(group);
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while deleting the group: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> SoftDeleteAsync(Guid id)
        {
            try
            {
                var group = await _context.Groups.FindAsync(id);
                if (group == null)
                    return false;

                group.IsDeleted = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while soft deleting the group: " + ex.InnerException?.Message ?? ex.Message);
            }     
        }

        public async Task<IEnumerable<Group>> GetAllAsync()
        {
            try
            {
                return await _context.Groups
                .Include(g => g.Members)
                .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving groups: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Group?> GetByIdAsync(Guid id)
        {
            try
            {
                return await _context.Groups
                .Include(g => g.Members)
                .FirstOrDefaultAsync(g => g.Id == id);
            }
            catch (Exception ex)
            {
               throw new Exception("An error occurred while retrieving the group by id: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Group?> GetByNameAsync(string name)
        {
            try
            {
                return await _context.Groups
                .Include (g => g.Members)
                .FirstOrDefaultAsync(g => g.Name == name);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the group by name: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Group> UpdateAsync(Group group)
        {
            try
            {
                _context.Groups.Update(group);
                await _context.SaveChangesAsync();
                return group;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while updating the group: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Member> AddMemberToGroupAsync(Member member, Guid groupId)
        {
            try
            {
                Group? group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == groupId);
                if (group == null) throw new Exception("Group not found.");

                group.Members.Add(member);
                await _context.SaveChangesAsync();

                return member;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while adding the member to the group: " + ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
