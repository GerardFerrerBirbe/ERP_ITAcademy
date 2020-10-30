﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ITAcademyERP.Data.DTOs
{
    public class EmployeeDTO
    {
        public Guid Id { get; set; }

        public string PersonId { get; set; }

        [Required(ErrorMessage = "Camp requerit")]
        [StringLength(30, ErrorMessage = "L'email ha de tenir menys de 30 caràcters")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Camp requerit")]
        [StringLength(30, ErrorMessage = "El nom ha de tenir menys de 30 caràcters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Camp requerit")]
        [StringLength(40, ErrorMessage = "El cognom ha de tenir menys de 40 caràcters")]
        public string LastName { get; set; }
        
        public ICollection<AddressDTO> Addresses { get; set; }

        [StringLength(30, ErrorMessage = "La posició ha de tenir menys de 30 caràcters")]
        public string Position { get; set; }
        
        public double Salary { get; set; }

    }
}