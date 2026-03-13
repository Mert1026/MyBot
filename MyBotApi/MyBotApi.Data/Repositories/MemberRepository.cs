using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
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
    public class MemberRepository : IMemberRepository
    {
        private readonly ApplicationDbContext _context;
        public MemberRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Member> CreateAsync(Member member)
        {
            try
            {
                _context.Members.Add(member);
                await _context.SaveChangesAsync();
                return member;
            }          
            catch(Exception ex)
            {
                throw new Exception("An error occurred while creating the member: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            try
            {
                var member = await _context.Members.FindAsync(id);
                if (member == null)
                    return false;

                _context.Members.Remove(member);
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while deleting the member: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> SoftDeleteAsync(Guid id)
        {
            try
            {
                var member = await _context.Members.FindAsync(id);
                if (member == null)
                    return false;

                member.IsDeleted = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw new Exception($"An error occurred while soft deleting the member: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<IEnumerable<Member>> GetAllAsync()
        {
            try
            {
                return await _context.Members
                .ToListAsync();
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while retrieving members: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Member?> GetByIdAsync(Guid id)
        {
            try
            {
                return await _context.Members
                .FirstOrDefaultAsync(m => m.Id == id);
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while retrieving the member: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<Member> UpdateAsync(Member member)
        {
            try
            {
                _context.Members.Update(member);
                await _context.SaveChangesAsync();
                return member;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while updating the member: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<bool> ChangeStatusAsync(Guid id, bool status)
        {
            try
            {
                Member? memberCheck = _context.Members.FirstOrDefault(m => m.Id == id);
                if (memberCheck != null)
                {
                    memberCheck.Status = status;
                    _context.Members.Update(memberCheck);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while changing the member's status: " + ex.InnerException?.Message ?? ex.Message);
            }
        }

        public async Task<List<Member>> GetAllByParentIdAsync(Guid parentId)
        {
            try
            {
                List<Member>? members = await _context.Members
                .Where(m => m.ParentId == parentId)
                .ToListAsync();
                return members;
            }
            catch(Exception ex)
            {
                throw new Exception("An error occurred while retrieving members by parent id: " + ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
