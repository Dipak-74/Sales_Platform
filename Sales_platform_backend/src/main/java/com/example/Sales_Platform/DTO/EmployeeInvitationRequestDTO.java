package com.example.Sales_Platform.DTO;

public class EmployeeInvitationRequestDTO {
	 private String name;
	    private String email;
	    private Long managerId;
	    private Long departmentId;
	    private String designation;
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public Long getManagerId() {
			return managerId;
		}
		public void setManagerId(Long managerId) {
			this.managerId = managerId;
		}
		public Long getDepartmentId() {
			return departmentId;
		}
		public void setDepartmentId(Long departmentId) {
			this.departmentId = departmentId;
		}
		public String getDesignation() {
			return designation;
		}
		public void setDesignation(String designation) {
			this.designation = designation;
		}
	    
}
