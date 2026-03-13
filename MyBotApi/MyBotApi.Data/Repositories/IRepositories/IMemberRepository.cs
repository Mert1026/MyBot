using MyBotApi.Data.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Repositories.IRepositories
{
    public interface IMemberRepository
    {
        Task<Member?> GetByIdAsync(Guid id);
        Task<IEnumerable<Member>> GetAllAsync();
        Task<Member> CreateAsync(Member group);
        Task<Member> UpdateAsync(Member group);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> SoftDeleteAsync(Guid id);
        Task<bool> ChangeStatusAsync(Guid id, bool status);
        Task<List<Member>> GetAllByParentIdAsync(Guid parentId);
    }
}
