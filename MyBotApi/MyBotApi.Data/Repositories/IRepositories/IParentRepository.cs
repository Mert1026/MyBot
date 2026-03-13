using MyBotApi.Data.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyBotApi.Data.Repositories.IRepositories
{
    public interface IParentRepository
    {
        Task<Parent?> GetByIdAsync(Guid id);
        Task<IEnumerable<Parent>> GetAllAsync();
        Task<Parent> CreateAsync(Parent parent);
        Task<Parent> UpdateAsync(Parent parent);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> SoftDeleteAsync(Guid id);
    }
}
