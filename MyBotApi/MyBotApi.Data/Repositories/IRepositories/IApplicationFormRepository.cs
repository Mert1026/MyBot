using MyBotApi.Data.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Repositories.IRepositories
{
    public interface IApplicationFormRepository
    {
        Task<ApplicationForm?> GetByIdAsync(Guid id);
        Task<IEnumerable<ApplicationForm>> GetByMemberIdAsync(Guid memberId);
        Task<IEnumerable<ApplicationForm>> GetByParentIdAsync(Guid parentId);
        Task<IEnumerable<ApplicationForm>> GetAllAsync();
        Task<ApplicationForm> CreateAsync(ApplicationForm form);
        Task<ApplicationForm> UpdateAsync(ApplicationForm form);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> SoftDeleteAsync(Guid id);
    }
}
