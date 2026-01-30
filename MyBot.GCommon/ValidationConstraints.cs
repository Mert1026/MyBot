using System;
using System.Collections.Generic;
using System.Text;

namespace MyBot.GCommon
{
    public class ValidationConstraints
    {
        public class Applications
        {
            public const int ParentFirstNameMaxLength = 50;
            public const int ParentLastNameMaxLength = 70;
            public const int ParentEmailMaxLength = 50;
            public const int ParentPhoneMaxLength = 30;
            public const int ChildNameMaxLength = 50;
            public const bool IsReviewedDefaultValue = false;
            public const bool IsDeletedDefaultValue = false;
        }

        public class Groups
        {
            public const int GroupNameMaxLength = 70;
            public const int DescriptionMaxLength = 300;
            public const bool IsActiveDefaultValue = false;
            public const bool IsDeletedDefaultValue = false;
        }
    }
}
