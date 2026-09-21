package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.*;
import com.example.Sales_Platform.Intities.InvitationStatus;

public interface EmployeeInvitationServices {
	 EmployeeInvitationResponseDTO createInvitation(
	            EmployeeInvitationRequestDTO request);

	    EmployeeInvitationResponseDTO getInvitationById(Long id);

	    List<EmployeeInvitationResponseDTO> getInvitationsByManager(
	            Long managerId);

	    EmployeeInvitationResponseDTO updateInvitationStatus(
	            Long id,
	            InvitationStatus status);
}
