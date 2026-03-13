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
    public class ParentRepository : IParentRepository
    {
        private readonly ApplicationDbContext _context;
        public ParentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Parent> CreateAsync(Parent parent)
        {
            try
            {
                _context.Parents.Add(parent);
                await _context.SaveChangesAsync();
                return parent;
            }
            catch(Exception ex)
            {
                throw new Exception("Error creating parent: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            try
            {
                var parent = await _context.Parents.FindAsync(id);
                if (parent == null)
                    return false;

                _context.Parents.Remove(parent);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting parent: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> SoftDeleteAsync(Guid id)
        {
            try
            {
                var parent = await _context.Parents.FindAsync(id);
                if (parent == null)
                    return false;

                parent.IsDeleted = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch( Exception ex)
            {
                throw new Exception("Error soft deleting parent: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<IEnumerable<Parent>> GetAllAsync()
        {
            try
            {
                return await _context.Parents
                .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving parents: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Parent?> GetByIdAsync(Guid id)
        {
            try
            {
                return await _context.Parents
                .FirstOrDefaultAsync(m => m.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving parent by id: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Parent> UpdateAsync(Parent parent)
        {
            try
            {
                _context.Parents.Update(parent);
                await _context.SaveChangesAsync();
                return parent;
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating parent: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> ChangePayedUntilDate(Guid id, DateTimeOffset date)
        {
            try
            {
                var parent = await _context.Parents.FindAsync(id);
                if (parent == null)
                    return false;

                parent.PayedUntil = date;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error changing payed until date: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

    }
}
