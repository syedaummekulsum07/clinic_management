// console.log('admin page js');
(function () {
	if (!localStorage.getItem("token")) window.location.href = "/login";
	$("#setName").text(`Hi ${localStorage.getItem("name")}`);
	let role = localStorage.getItem("role");
	$("#setRole").text(role);
	// if (role != "RECEPTIONIST" && role != "DOCTOR") {
	// 	$("#showSlotMenu").css("display", "none");
	// } else {
	// 	$("#showSlotMenu").css("display", "block");
	// }
    
	if (role === "ADMIN" || role === "PATIENT") {
		$("#showSlotMenu").css("display", "none");
	} else {
		$("#showSlotMenu").css("display", "block");
	}
	showToastMessage("Welcome to HomePage", "info", true);

	if(role=="ADMIN"){
		$("#showAppointmentMenu").css("display","none")
	}
})();


