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
    public class ApplicationFormRepository : IApplicationFormRepository
    {
        private readonly ApplicationDbContext _context;
        public ApplicationFormRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ApplicationForm> CreateAsync(ApplicationForm form)
        {
            try
            {
                await _context.ApplicationForms.AddAsync(form);
                await _context.SaveChangesAsync();
                return form;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while creating the application form: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            try
            {
                ApplicationForm? form = await _context.ApplicationForms.FindAsync(id);
                if (form == null) return false;
                _context.ApplicationForms.Remove(form);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deletig the form: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<IEnumerable<ApplicationForm>> GetAllAsync()
        {
            try
            {
                return await _context.ApplicationForms
                    .ToListAsync();
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while retrieving the application forms: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<ApplicationForm?> GetByIdAsync(Guid id)
        {
            try
            {
                return await _context.ApplicationForms
                    .FirstOrDefaultAsync(f => f.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the application form: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<IEnumerable<ApplicationForm>> GetByMemberIdAsync(Guid memberId)
        {
            try
            {
               Member? member = await _context.Members.FirstOrDefaultAsync(m => m.Id == memberId);
               if (member == null) throw new Exception("Member not found with the provided id.");

               return await _context.ApplicationForms.Include(f => f.Kids)
                   .Where(f => f.Kids.Any(k => k.Id == memberId))
                   .ToListAsync();
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while retrieving the application form by member id: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<IEnumerable<ApplicationForm>> GetByParentIdAsync(Guid parentId)
        {
            try
            {
                Parent? parent = await _context.Parents.FirstOrDefaultAsync(p => p.Id == parentId);
                if (parent == null) throw new Exception("Parent not found with the provided id.");

                return await _context.ApplicationForms.Include(f => f.Kids)
                    .Where(f => f.Kids.Any(k => k.ParentId == parentId))
                    .ToListAsync();
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while retrieving the application form by parent id: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> SoftDeleteAsync(Guid id)
        {
            try
            {
                await _context.ApplicationForms.Where(f => f.Id == id)
                    .ExecuteUpdateAsync(s => s.SetProperty(f => f.IsDeleted, true));

                return true;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while soft deleting the form: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<ApplicationForm> UpdateAsync(ApplicationForm form)
        {
            try
            {
                _context.ApplicationForms.Update(form);
                await _context.SaveChangesAsync();
                return form;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the form: " + ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
