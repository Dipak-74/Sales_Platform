package com.example.Sales_Platform.DTO;

import com.example.Sales_Platform.Intities.DepartmentStatus;

public class DepartmentResponseDTO {
	   private Long departmentId;
	    private String name;
	    private String description;
	    private DepartmentStatus status;
	    
		public DepartmentResponseDTO() {
			super();
			// TODO Auto-generated constructor stub
		}
		public Long getDepartmentId() {
			return departmentId;
		}
		public void setDepartmentId(Long departmentId) {
			this.departmentId = departmentId;
		}
		public DepartmentResponseDTO(Long departmentId, String name, String description, DepartmentStatus status) {
			super();
			this.departmentId = departmentId;
			this.name = name;
			this.description = description;
			this.status = status;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getDescription() {
			return description;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		public DepartmentStatus getStatus() {
			return status;
		}
		public void setStatus(DepartmentStatus status) {
			this.status = status;
		}
	    
	    
}
