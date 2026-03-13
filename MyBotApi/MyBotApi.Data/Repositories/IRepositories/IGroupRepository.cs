using MyBotApi.Data.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Repositories.IRepositories
{
    public interface IGroupRepository
    {
        Task<Group?> GetByIdAsync(Guid id);
        Task<Group?> GetByNameAsync(string name);
        Task<IEnumerable<Group>> GetAllAsync();
        Task<Group> CreateAsync(Group group);
        Task<Group> UpdateAsync(Group group);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> SoftDeleteAsync(Guid id);
        Task<Member> AddMemberToGroupAsync(Member member, Guid groupId);
    }
}
