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
            _context.Members.Add(member);
            await _context.SaveChangesAsync();
            return member;            
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return false;

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoftDeleteAsync(Guid id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return false;

            member.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Member>> GetAllAsync()
        {
            return await _context.Members
            .ToListAsync();
        }

        public async Task<Member?> GetByIdAsync(Guid id)
        {
            return await _context.Members
            .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Member> UpdateAsync(Member member)
        {
            _context.Members.Update(member);
            await _context.SaveChangesAsync();
            return member;
        }

        public async Task<bool> ChangeStatusAsync(Guid id, bool status)
        {
            Member? userCheck = _context.Members.FirstOrDefault(m => m.Id == id);
            if (userCheck != null)
            {
                userCheck.Status = status;
                _context.Members.Update(userCheck);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
