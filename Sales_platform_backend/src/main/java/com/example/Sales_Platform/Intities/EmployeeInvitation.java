package com.example.Sales_Platform.Intities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_invitations")
public class EmployeeInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    private String designation;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status;

    private LocalDateTime invitedAt;
    private LocalDateTime acceptedAt;

    @PrePersist
    public void onCreate() {
        invitedAt = LocalDateTime.now();
    }

	public EmployeeInvitation() {
		super();
		// TODO Auto-generated constructor stub
	}

	public EmployeeInvitation(Long id, String name, String email, User manager, Department department,
			String designation, InvitationStatus status, LocalDateTime invitedAt, LocalDateTime acceptedAt) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.manager = manager;
		this.department = department;
		this.designation = designation;
		this.status = status;
		this.invitedAt = invitedAt;
		this.acceptedAt = acceptedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public User getManager() {
		return manager;
	}

	public void setManager(User manager) {
		this.manager = manager;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public InvitationStatus getStatus() {
		return status;
	}

	public void setStatus(InvitationStatus status) {
		this.status = status;
	}

	public LocalDateTime getInvitedAt() {
		return invitedAt;
	}

	public void setInvitedAt(LocalDateTime invitedAt) {
		this.invitedAt = invitedAt;
	}

	public LocalDateTime getAcceptedAt() {
		return acceptedAt;
	}

	public void setAcceptedAt(LocalDateTime acceptedAt) {
		this.acceptedAt = acceptedAt;
	}

    
}
