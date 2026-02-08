let activeList = ["ACTIVE", "INACTIVE"];

let selectedSLotId = "";
let role = localStorage.getItem("role");
let roleList = [];
if (role == "ADMIN") roleList = ["RECEPTIONIST", "DOCTOR", "ADMIN"];
else if (role == "RECEPTIONIST") roleList = ["PATIENT"];
let avilableSlotList = [];
let durationList = [20, 30];
let appointmentId = "";
let startTimeList = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
];
let followUpDate = getNextDates(7, true)[0];
let endTimeList = [
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
];
let experience = [
  "0-1 years",
  "1-2 years",
  "2-3 years",
  "3-4 years",
  "4-5 years",
];
const hospital = [
  "AIIMS, New Delhi",
  "Apollo Hospitals, Chennai",
  "Fortis Memorial Research Institute, Gurugram",
  "Medanta – The Medicity, Gurugram",
  "Christian Medical College (CMC), Vellore",
  "Narayana Health, Bengaluru",
  "Manipal Hospitals, Bengaluru",
  "Tata Memorial Hospital, Mumbai",
  "PD Hinduja National Hospital, Mumbai",
  "Care Hospitals, Hyderabad",
  "Continental Hospitals, Hyderabad",
  "Yashoda Hospitals, Hyderabad",
  "Safdarjung Hospital, New Delhi",
];
let specializationList = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Psychiatrist",
  "Gynecologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Dentist",
];
let expList = [];
let qualificationList = [
  "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
  "BDS (Bachelor of Dental Surgery)",
  "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
  "BHMS (Bachelor of Homeopathic Medicine and Surgery)",
  "BUMS (Bachelor of Unani Medicine and Surgery)",
  "BSMS (Bachelor of Siddha Medicine and Surgery)",
  "MD (Doctor of Medicine)",
  "MS (Master of Surgery)",
  "DM (Doctorate of Medicine - Super Specialty)",
  "MCh (Master of Chirurgiae - Super Specialty Surgery)",
  "DNB (Diplomate of National Board)",
  "PhD (Doctor of Philosophy in Medical Sciences)",
  "MDS (Master of Dental Surgery)",
  "M.Pharm (Master of Pharmacy - for clinical practice/research)",
  "MPH (Master of Public Health)",
  "Diploma in Clinical Pathology",
  "Diploma in Child Health",
  "Diploma in Orthopedics",
  "Fellowship in Cardiology",
  "Fellowship in Oncology",
];
const recommendedTests = [
  "Complete Blood Count (CBC)",
  "Hemoglobin (Hb)",
  "Blood Sugar (Fasting/PP/Random)",
  "HbA1c (Glycated Hemoglobin)",
  "Lipid Profile",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT / RFT)",
  "Thyroid Profile (T3, T4, TSH)",
  "Vitamin D",
  "Vitamin B12",

  "Urine Routine & Microscopy",

  "HIV Test",
  "Hepatitis B Surface Antigen (HBsAg)",
  "Hepatitis C Virus (HCV)",

  "CRP (C-Reactive Protein)",
  "ESR (Erythrocyte Sedimentation Rate)",
  "PSA (Prostate Specific Antigen)",
  "CA-125",
  "CEA (Carcinoembryonic Antigen)",
  "AFP (Alpha-fetoprotein)",

  "Blood Grouping & Rh Typing",
];
let doctorList = "";
let patientList = [];

(function () {
  if (!localStorage.getItem("token")) window.location.href = "/login";

  $("#setName").text(`Hi ${localStorage.getItem("name")}`);
  let role = localStorage.getItem("role");
  $("#setRole").text(role);


  if(role=="DOCTOR"){
    $("#showSlotAdd").css("display", "none")
  }
  if (role === "ADMIN" || role === "PATIENT") {
    $("#showSlotMenu").css("display", "none");
  } else {
    $("#showSlotMenu").css("display", "block");
  }
  if (role != "RECEPTIONIST" && role != "DOCTOR") {
    $("#showSlotMenu").css("display", "none");
  } else {
    $("#showSlotMenu").css("display", "block");
  }
  getUserList();
  getSlotList();
  getAppointmentList();
})();

let availableSlotsListByDate = [];

function showData(...data) {
  console.log("data to view ", data);

  $("#myModal").modal("show");

  for (let item of doctorList) {
    $("#doctor").append($(`<option>`).val(item).text(item));
  }

  for (let item of startTimeList) {
    $("#startTime").append($(`<option>`).val(item).text(item));
  }

  for (let item of endTimeList) {
    $("#endTime").append($(`<option>`).val(item).text(item));
  }

  for (let item of durationList) {
    $("#duration").append($(`<option>`).val(item).text(item));
  }

  for (let item of roleList) {
    $("#role").append($(`<option>`).val(item).text(item));
  }
}
let addedInvestigation = [];
function addInvestigation() {
  if (addedInvestigation.length == 6) {
    showPresErrorMessage("Limit reached for tests", true);
    return;
  }

  let recommendedTests = $("#recommendedTests").val();
  let result = $("#result").val();
  let testExist = addedInvestigation.find(
    (item) => item.testName == recommendedTests
  );
  if (testExist) {
    showPresErrorMessage("Tests already been added.", true);
    return;
  }
  addedInvestigation.push({
    testName: recommendedTests,
    result: result,
    cost: 0,
  });
  let str = `<div class="form-group col-md-6">
												<label for="investigation"></label>
												<input
													type="text"
													autocomplete="false"
													class="form-control med-input"
													value="${recommendedTests}${result ? `          |    (${result})` : ""}"
													readonly />
													<span>
												<i class="fa fa-times med-close" aria-hidden="true" onclick="deleteInvestigation('${
                          addedInvestigation.length - 1
                        }')"></i>
</span>
											</div>`;

  $("#addTests").append(str);
}
let addMedicineList = [];
function addMedicine() {
  if (addMedicineList.length == 6) {
    showPresErrorMessage("Limit reached for medicine", true);
    return;
  }

  let medicineName = $("#name").val();
  let quantity = $("#quantity").val();
  let time = $("#time").val();
  let haveIt = $("#haveIt").val();
  let doses = $("#doses").val();
  let testExist = addMedicineList.find((item) => item.name == medicineName);
  if (testExist) {
    showPresErrorMessage("Medicine already been added.", true);
    return;
  }
  // console.log(hospital, expYear);
  addMedicineList.push({
    name: medicineName,
    quantity: quantity,
    doses: doses,
    time: time,
    haveIt: haveIt,
    cost: 0,
  });
  // let str = "";
  // for (let item of addMedicineList) {
  let str = `<div class="form-group col-md-6">
												<label for="investigation"></label>
												<input
													type="text"
													autocomplete="false"
													class="form-control med-input"
													value="(${medicineName})-(${quantity})-(${doses})-(${time})-(${haveIt})"
													readonly />
													<span>
												<i class="fa fa-times med-close" aria-hidden="true" onclick="deleteMedicine('${
                          addMedicineList.length - 1
                        }')"></i>
</span>
												
											</div>`;
  // }

  $("#addMedicines").append(str);
}
let quantityList = [1, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
let timeList = [
  "MORNING",
  "AFTERNOON",
  "NIGHT",
  "MORNING-NIGHT",
  "MORNING-AFTERNOON-NIGHT",
];
let dosesList = ["ONE", "TWO", "THREE"];
let haveItList = ["BEFORE-FOOD", "AFTER-FOOD"];
function editInvestigation(id, name, result) {
  console.log("---", name, result);

  $("#recommendedTests").val(name);
  $("#result").val(result);
  $("#showUpdateInvestigation").css("display", "block");
  $("#showUpdateIcon").css("display", "block");
  $("#showAddInvestigation").css("display", "none");
}

function updateInvestigation() {
  let recommendedTests = $("#recommendedTests").val();
  let result = $("#result").val();
  for (let item of addedInvestigation) {
    if (item.testName == recommendedTests) {
      item.result = result;
    }
  }
  document.getElementById("addTests").innerHTML = "";

  let str = "";
  for (let [index, item] of addedInvestigation.entries()) {
    str += `<div class="form-group col-md-6">
												<label for="investigation"></label>
												<input
													type="text"
													autocomplete="false"
													id="${item._id}"
													class="form-control med-input"
													value="${item.testName}${item.result ? `          |    (${item.result})` : ""}"
													readonly />
													<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editInvestigation('${
                            item._id
                          }','${item.testName}', '${
      item.result
    }')" style="display:${item.hasOwnProperty("_id") ? "block" : "none"}"></i>
												<i class="fa fa-times med-close" aria-hidden="true" onclick="deleteInvestigation('${
                          item.hasOwnProperty("_id") ? item._id : index
                        }')"></i>
</span>
													
											</div>`;
  }

  $("#addTests").append(str);
  console.log(JSON.stringify(addInvestigation));
  $("#showUpdateInvestigation").css("display", "none");
  $("#showUpdateIcon").css("display", "none");
  $("#showAddInvestigation").css("display", "block");
  $("#result").val("");
}

function updateInvestigationBill() {
  let recommendedTests = $("#recommendedTestsBill").val();
  let cost = $("#testCostBill").val();
  for (let item of addedInvestigation) {
    if (item.testName == recommendedTests) {
      item.cost = cost;
    }
  }
  document.getElementById("addTestsBill").innerHTML = "";

  let str = "";
  for (let [index, item] of addedInvestigation.entries()) {
    str += `<div class="form-group col-md-6">
												<label for="investigation"></label>
												<input
													type="text"
													autocomplete="false"
													id="${item._id}"
													class="form-control med-input"
													
													value="${item.testName}${
      item.result ? `          |    (${item.result})` : ""
    }           |   Rs: ${item.cost}"
													readonly />
													<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editInvestigationBill('${
                            item._id
                          }','${item.testName}', '${item.result}',  '${
      item.cost
    }')" style="display:${item.hasOwnProperty("_id") ? "block" : "none"}"></i>
												
</span>
													
											</div>`;
  }

  $("#addTestsBill").append(str);
  console.log(JSON.stringify(addInvestigation));
  $("#testCostBill").val("");

  $("#showUpdateInvestigationBill").css("display", "none");
  $("#showUpdateIconBill").css("display", "none");
}

function updateMedicineBill() {
  let medicineName = $("#nameBill").val();
  let cost = $("#medicineCostBill").val();
  for (let item of addMedicineList) {
    if (item.name == medicineName) {
      item.cost = cost;
    }
  }
  document.getElementById("addMedicinesBill").innerHTML = "";

  let str = "";
  for (let [index, item] of addMedicineList.entries()) {
    str += `<div class="form-group col-md-6">
											<label for="investigation"></label>
											<input
												type="text"
												id="${item._id}"
												autocomplete="false"
												class="form-control med-input"
												value="(${item.name})-(${item.quantity})           |   Rs: ${item.cost}"
												readonly />
												<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editMedicineBill('${item._id}','${item.name}','${item.quantity}','${item.cost}')"></i>
												
</span>
										</div>`;
  }

  $("#addMedicinesBill").append(str);
  $("#medicineCostBill").val("");
  $("#medicinePerCostBill").val("");
  $("#nameBill").val("");

  $("#showUpdateMedicineBill").css("display", "none");
  $("#showUpdateMedicineIconBill").css("display", "none");
  $("#showMedicinePerCostBill").css("display", "none");
  // $("#showAddInvestigation").css("display", "block");
  // $("#result").val("");
}

function editInvestigationBill(id, name, result, cost) {
  console.log("---", name, result);

  $("#recommendedTestsBill").val(name);
  $("#testCostBill").val(cost);
  $("#showUpdateInvestigationBill").css("display", "block");
  $("#showUpdateIconBill").css("display", "block");
}

$("#medicinePerCostBill").on("keyup", function () {
  let eachMedicineCost = $(this).val();
  let quantity = $("#quantityBill").val();
  let totalCost = parseInt(eachMedicineCost) * parseInt(quantity);
  $("#medicineCostBill").val(totalCost);
});
// function calculateMedicineCost() {
// 	let quantity = $("#quantityBill").val();
// 	let eachMedicineCost = $("#medicinePerCostBill").val();
// 	let totalCost = parseInt(eachMedicineCost) * parseInt(quantity);
// 	$("#medicineCostBill").val(totalCost);
// }
function editMedicineBill(id, name, quantity, cost) {
  console.log("---", name, result);

  $("#nameBill").val(name);
  $("#medicineCostBill").val(cost);
  $("#quantityBill").val(quantity);
  $("#showUpdateMedicineBill").css("display", "block");
  $("#showUpdateMedicineIconBill").css("display", "block");
  $("#showMedicinePerCostBill").css("display", "block");
}
function deleteInvestigation(id) {
  document.getElementById("addTests").innerHTML = "";
  if (id.length > 10) {
    addedInvestigation = addedInvestigation.filter((item) => item._id != id);
  } else {
    addedInvestigation.splice(parseInt(id), 1);
  }
  if (addedInvestigation.length > 0) {
    let str = "";
    for (let [index, item] of addedInvestigation.entries()) {
      str += `<div class="form-group col-md-6">
											<label for="investigation"></label>
											<input
												type="text"
												autocomplete="false"
												id="${item.hasOwnProperty("_id") ? item._id : index}"
												class="form-control med-input"
												value="${item.testName}${item.result ? `          |    (${item.result})` : ""}"
												readonly />
												<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editInvestigation('${
                          item._id
                        }')" style="display:${
        item.hasOwnProperty("_id") ? "block" : "none"
      }"></i>
												<i class="fa fa-times med-close" aria-hidden="true" onclick="deleteInvestigation('${
                          item.hasOwnProperty("_id") ? item._id : index
                        }')"></i>
</span>
												
										</div>`;
    }

    $("#addTests").append(str);
  }
  console.log(addedInvestigation);
}

function deleteMedicine(id) {
  document.getElementById("addMedicines").innerHTML = "";
  if (id.length > 10) {
    addMedicineList = addMedicineList.filter((item) => item._id != id);
  } else {
    addMedicineList.splice(parseInt(id), 1);
  }
  // addMedicineList = addMedicineList.filter((item) => item._id != id);
  if (addMedicineList.length > 0) {
    let str = "";
    for (let [index, item] of addMedicineList.entries()) {
      str += `<div class="form-group col-md-6">
											<label for="investigation"></label>
											<input
												type="text"
												id="${item.hasOwnProperty("_id") ? item._id : index}"
												autocomplete="false"
												class="form-control med-input"
												value="(${item.name})-(${item.quantity})-(${item.doses})-(${item.time})-(${
        item.haveIt
      })"
												readonly />
												<span><i class="fa fa-pencil med-edit" aria-hidden="true" style="display:${
                          item.hasOwnProperty("_id") ? "block" : "none"
                        }"></i>
												<i class="fa fa-times med-close" aria-hidden="true" onclick="deleteMedicine('${
                          item.hasOwnProperty("_id") ? item._id : index
                        }')"></i>
</span>
										</div>`;
    }

    $("#addMedicines").append(str);
  }
  console.log(addedInvestigation);
}
function writePrescription(...data) {
  console.log("data to view ", data);
  document.getElementById("quantity").innerHTML = "";
  document.getElementById("time").innerHTML = "";
  document.getElementById("doses").innerHTML = "";
  document.getElementById("haveIt").innerHTML = "";

  addMedicineList = [];
  addedInvestigation = [];
  let role = localStorage.getItem("role");
  if (role == "RECEPTIONIST") {
    document.getElementById("addMedicinesBill").innerHTML = "";
    document.getElementById("addTestsBill").innerHTML = "";
    $("#notesBill").val("");
    let [doctorInfo, patientInfo, date, appointment_id, prescriptions] = data;
    let prescriptionResponse = JSON.parse(prescriptions);
    addMedicineList = prescriptionResponse.medicine;
    addedInvestigation = prescriptionResponse.investigations;
    document.getElementById("doctorInfoBill").value = doctorInfo;
    document.getElementById("patientInfoBill").value = patientInfo;
    document.getElementById("appointmentDateBill").value = formatDate(
      new Date(date)
    );
    $("#notesBill").val(prescriptionResponse.notes);

    if (addMedicineList.length > 0) {
      let str = "";
      for (let item of addMedicineList) {
        str += `<div class="form-group col-md-6">
											<label for="investigation"></label>
											<input
												type="text"
												id="${item._id}"
												autocomplete="false"
												class="form-control med-input"
												value="(${item.name})-(${item.quantity})           |   Rs: ${item.cost}"
												readonly />
												<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editMedicineBill('${item._id}','${item.name}','${item.quantity}','${item.cost}')"></i>
												
</span>
										</div>`;
      }

      $("#addMedicinesBill").append(str);
    }
    console.log("investigation---", addedInvestigation, addMedicineList);

    if (addedInvestigation.length > 0) {
      let str = "";
      for (let item of addedInvestigation) {
        str += `<div class="form-group col-md-6">
											<label for="investigation"></label>
											<input
												type="text"
												autocomplete="false"
												id="${item._id}"
												class="form-control med-input"
												value="${item.testName}${
          item.result ? `          |    (${item.result})` : ""
        }           |   Rs: ${item.cost}"
												readonly />
												<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editInvestigationBill('${
                          item._id
                        }','${item.testName}', '${item.result}','${
          item.cost
        }')"></i>
												
</span>
												
										</div>`;
      }

      $("#addTestsBill").append(str);
    }

    for (let item of quantityList) {
      $("#quantityBill").append($(`<option>`).val(item).text(item));
    }
    // for (let item of endTimeList) {
    // 	$("#endTime").append($(`<option>`).val(item).text(item));
    // }
    for (let item of recommendedTests) {
      $("#recommendedTestsBill").append($(`<option>`).val(item).text(item));
    }

    $("#billGenerationModal").modal("show");

    // billGenerationModal;
  } else if (role == "DOCTOR") {
    $("#setValue").val(`<i class="fa fa-plus" aria-hidden="true"></i>`);
    document.getElementById("addMedicines").innerHTML = "";
    document.getElementById("addTests").innerHTML = "";
    // $("#medicine").val("");
    $("#name").val("");
    $("#diagnosis").val("");
    $("#notes").val("");
    console.log("next dates--", followUpDate);

    let [doctorInfo, patientInfo, date, appointment_id, prescriptions] = data;
    let prescriptionResponse = JSON.parse(prescriptions);
    if (prescriptionResponse.diagnosis) {
      addMedicineList = prescriptionResponse.medicine;
      addedInvestigation = prescriptionResponse.investigations;

      if (addMedicineList.length > 0) {
        let str = "";
        for (let item of addMedicineList) {
          str += `<div class="form-group col-md-6">
												<label for="investigation"></label>
												<input
													type="text"
													id="${item._id}"
													autocomplete="false"
													class="form-control med-input"
													value="(${item.name})-(${item.quantity})-(${item.doses})-(${item.time})-(${item.haveIt})"
													readonly />
													<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editMedicine('${item._id}')"></i>
													<i class="fa fa-times med-close" aria-hidden="true" onclick="deleteMedicine('${item._id}')"></i>
</span>
											</div>`;
        }

        $("#addMedicines").append(str);
      }
      console.log("investigation---", addedInvestigation, addMedicineList);

      if (addedInvestigation.length > 0) {
        let str = "";
        for (let item of addedInvestigation) {
          str += `<div class="form-group col-md-6">
												<label for="investigation"></label>
												<input
													type="text"
													autocomplete="false"
													id="${item._id}"
													class="form-control med-input"
													value="${item.testName}${item.result ? `          |    (${item.result})` : ""}"
													readonly />
													<span><i class="fa fa-pencil med-edit" aria-hidden="true" onclick="editInvestigation('${
                            item._id
                          }','${item.testName}', '${item.result}')"></i>
													<i class="fa fa-times med-close" aria-hidden="true" onclick="deleteInvestigation('${
                            item._id
                          }')"></i>
</span>
													
											</div>`;
        }

        $("#addTests").append(str);
      }
      $("#followUpDate").val(
        formatDate(new Date(prescriptionResponse.followUpDate))
      );
      $("#notes").val(prescriptionResponse.notes);
      $("#diagnosis").val(prescriptionResponse.diagnosis);
    } else {
      $("#followUpDate").val(followUpDate);
      $("#notes").val("");
    }

    console.log({ appointmentId });

    appointmentId = appointment_id;

    $("#addbtn").css("display", "none");
    $("#updatebtn").css("display", "block");
    $("#registerClient").trigger("reset");
    $("#year").prop("disabled", false);
    $("#month").prop("disabled", false);
    $("#day").prop("disabled", false);
    $("#active-check").prop("disabled", false);
    $("#year").empty();
    $("#month").empty();
    $("#day").empty();
    $("#userName").prop("readonly", true);

    for (let item of quantityList) {
      $("#quantity").append($(`<option>`).val(item).text(item));
    }
    for (let item of timeList) {
      $("#time").append($(`<option>`).val(item).text(item));
    }
    for (let item of dosesList) {
      $("#doses").append($(`<option>`).val(item).text(item));
    }
    for (let item of haveItList) {
      $("#haveIt").append($(`<option>`).val(item).text(item));
    }

    for (let item of recommendedTests) {
      $("#recommendedTests").append($(`<option>`).val(item).text(item));
    }

    document.getElementById("doctorInfo").value = doctorInfo;
    document.getElementById("patientInfo").value = patientInfo;
    document.getElementById("appointmentDate").value = formatDate(
      new Date(date)
    );
    $("#role").attr("disabled", true);
    $("#active-check").prop("checked", active);

    if (role == "SUPER-ADMIN" || role == "ADMIN")
      $("#active-check").prop("disabled", true);
    else $("#active-check").prop("disabled", false);
    $("#presModal").modal("show");
  } else {
    showToastMessage(
      "Sorry...You are not allowed..But still you can see ur Prescription/Report/Bill.",
      "warning"
    );
  }
}
function viewData(...data) {
  console.log("data to view ", data);

  $("#myModal").modal("show");

  for (let item of doctorList) {
    $("#doctor").append($(`<option>`).val(item).text(item));
  }

  for (let item of startTimeList) {
    $("#startTime").append($(`<option>`).val(item).text(item));
  }

  for (let item of endTimeList) {
    $("#endTime").append($(`<option>`).val(item).text(item));
  }
  for (let item of qualificationList) {
    $("#qualification").append($(`<option>`).val(item).text(item));
  }
  for (let item of durationList) {
    $("#duration").append($(`<option>`).val(item).text(item));
  }

  for (let item of roleList) {
    $("#role").append($(`<option>`).val(item).text(item));
  }
  for (let item of hospital) {
    $("#hospital").append($(`<option>`).val(item).text(item));
  }
  for (let item of experience) {
    $("#expYears").append($(`<option>`).val(item).text(item));
  }

  $("#role").attr("disabled", true);
}
function updateData() {
  let activeCheck = document.getElementById("active-check").value;
  console.log("activeCheck", activeCheck);
  let active = activeCheck == "on" || activeCheck ? true : false;

  let obj = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    salary: document.getElementById("salary").value,
    year: document.getElementById("year").value,
    month: document.getElementById("month").value,
    day: document.getElementById("day").value,
    active,
  };
  let isFormValid = formValidation(obj);
  if (!isFormValid) return false;
  let params = document.getElementById("userName").value;
  $("#register-loader").css("visibility", "visible");
  patchData("update_employees", obj, null, params, function (result, error) {
    if (error) console.log(error);
    console.log({ "data received from": result });
    $("#register-loader").css("visibility", "hidden");
    showToastMessage(result.message, "success");
    $("#registerClient").trigger("reset");
    $("#myModal").modal("hide");
    $("#active").empty();
    // getUserList();
    setTimeout(() => {
      getUserList();
    }, 2000);
  });
}

function showModalWithSelect(data) {
  // patientList = [];
  document.getElementById("patients").innerHTML = "";
  document.getElementById("dates").innerHTML = "";

  console.log("showmodle with select", data);
  for (let i of data) {
    $(`#${i}`).css("border-left", "3px #434242 solid");
    $(`#${i}`).prop("readonly", false);
  }
  $("#addbtn").css("display", "block");
  $("#updatebtn").css("display", "none");
  $("#status").css("color", backgrndColor["success"]);
  $("#status").val("T");
  $("#registerClient").trigger("reset");
  $("#display-message").css("visibility", "hidden");
  $("#year").empty();
  $("#month").empty();
  $("#day").empty();
  $("#role").empty();

  $("#year").prop("disabled", false);
  $("#userName").prop("readonly", true);
  $("#month").prop("disabled", false);
  $("#day").prop("disabled", false);
  $("#active-check").prop("disabled", false);
  // $("#active-check").empty();

  $("#doctor").val(
    `${doctorList.firstName} ${doctorList.lastName} - ${doctorList.specialization} - ${doctorList.qualifications} - ${doctorList.consultationFee}`
  );
  $("#consultationsFee").val(doctorList.consultationFee);
  /*   >Name - Gender - Date of Birth - Blood Group</  */
  console.log({ patientList });

  for (let item of patientList) {
    let patientDetail = `${item.firstName} ${item.lastName} - ${
      item.gender
    } - ( ${formatDate(new Date(item.dateOfBirth))} ) - ( ${item.bloodGroup} )`;
    $("#patients").append($(`<option>`).val(item._id).text(patientDetail));
  }

  for (let item of startTimeList) {
    $("#startTime").append($(`<option>`).val(item).text(item));
  }

  for (let item of endTimeList) {
    $("#endTime").append($(`<option>`).val(item).text(item));
  }
  for (let item of availableDateList) {
    $("#dates").append(
      $(`<option>`)
        .val(JSON.stringify(item))
        .text(formatDate(new Date(item.date)))
    );
  }
  $("#dates").trigger("change");

  for (let item of durationList) {
    $("#duration").append($(`<option>`).val(item).text(item));
  }

  for (let item of roleList) {
    $("#role").append($(`<option>`).val(item).text(item));
  }
  $("#role").prop("disabled", false);

  $("#role").val(roleList[0]);
  $("#active-check").prop("disabled", true);
  let roleData = $("#role").val();
  if (roleData === "DOCTOR") $("#isDoctor").css("display", "block");
  else $("#isDoctor").css("display", "none");
}

function getCheckedData(e, checkboxId) {
  $("#active-check").val(e.target.checked);
}
function getUserList(filterObj) {
  let filterList = {};
  if (filterObj) {
    for (let item in filterObj) filterList[item] = filterObj[item];
  }

  getDataList("users", null, filterList, function (result, error) {
    if (error) console.log(error);

    if (result.data.length == 0) showToastMessage(result.message, "info");
    console.log("---", result.data);

    let str = "";
    let loggedInRole = localStorage.getItem("role");

    if (loggedInRole == "RECEPTIONIST" || loggedInRole == "PATIENT") {
      console.log(
        "patientList---",
        result.data.filter((item) => item.role == "PATIENT")
      );

      doctorList = result.data.find((item) => item.role == "DOCTOR");
      patientList = result.data.filter((item) => item.role == "PATIENT");
      console.log({ patientList });

      localStorage.setItem("doctorId", doctorList._id);
    }
  });
}

function selectSlotFromList(slotParentId, slot, id) {
  console.log(slotParentId, slot, id);
  $(`#${id}`).css("border-left", "5px #229f96 solid");
  $(`#${id}`).find("span").css("background-color", "#c4f4d7");
  // $(`#${id}`).css("border-right", "5px #229f96 solid");
  for (let item of availableSlotsListByDate.slots) {
    if (item._id != id && !item.status) {
      $(`#${item._id}`).css("border-left", "1px solid #ccc");
      $(`#${item._id}`).find("span").css("background-color", "#fff");
    }
  }
  $("#selectedSlot").val(slot);
}

$("#dates").on("change", function () {
  console.log("data", $(this).val());

  $("#selectedSlot").val("");
  availableSlotsListByDate = JSON.parse($(this).val());
  selectedSLotId = availableSlotsListByDate._id;
  document.getElementById("addSlot").innerHTML = "";
  let str = `<p style="clear: both">Select slot from list below:</p>`;
  for (let item of availableSlotsListByDate.slots) {
    console.log(item.status);
    if (item.status) {
      str += `<div class="form-group col-md-1 col-md-1-appointment" onclick="selectSlotFromList('${availableSlotsListByDate._id}','${item.slot}','${item._id}')">
        
            <label class="radio-as-input" ></label>
    <input  class="radio-as-input-box" style="border:1px solid #ccc;background-color:#ccc;color:#000;margin-top:0px"
            type="button"
			id="${item._id}"
            value="${item.slot}" />
  
        
    </div>`;
    } else {
      str += `<div class="form-group col-md-1 col-md-1-appointment" style="padding-top:19px" onclick="selectSlotFromList('${availableSlotsListByDate._id}','${item.slot}','${item._id}')">
        
            <label class="radio-as-input" id="${item._id}">
    <input 
            type="radio"
            name="gender"
            value="${item.slot}" />
    <span>${item.slot}</span>
  </label>
        
    </div>`;
    }
  }
  $("#addSlot").append(str);
  for (let item of availableSlotsListByDate.slots) {
    if (!item.status) {
      // :
      $(`#${item._id}`).css("background-color", "#48bf36");
      $(`#${item._id}`).css("cursor", "pointer");

      $(`#${item._id}`).hover(
        function () {
          // $(this).find("span").css("background-color", "#0faf74");
          // $(this).find("span").css("color", "#fff");
          $(this).css("border-color", "1px solid #0faf74");
        }, // mouse enter
        function () {
          // $(this).find("span").css("background-color", "#fff");
          $(this).find("span").css("color", "#262424");
        } // mouse leave
      );
    } else {
      $(`#${item._id}`).prop("disabled", true);
      $(`#${item._id}`).find("span").css("background-color", "#ccc");
      // $(`#${item._id}`).css("color", "#fff");
    }
  }
});
function getSlotList(filterObj) {
  let filterList = {};
  if (filterObj) {
    for (let item in filterObj) filterList[item] = filterObj[item];
  }
  $("#tableList").html("");

  $("#show-main-loader").css("display", "block");
  $("#showTableDesc").html("Slot List");
  getDataList("slots", null, filterList, function (result, error) {
    if (error) console.log(error);

    if (result.data.length == 0) showToastMessage(result.message, "info");

    let str = "";
    // let loggedInRole = localStorage.getItem("role");
    availableDateList = result.data.map((item) => {
      return { _id: item._id, slots: item.slots, date: item.date };
    });

    // str +=`<tr><td>Total Amount</td><td>${response.data.totalAmount}</tr>`
    $("#tableList").append(str);
    if (!$("#active").val()) {
      $("#active").empty();

      for (let item of activeList) {
        // let selectedYear = item == todayDate[2] ? true : false;
        $("#active").append($(`<option>`).val(item).text(item));
      }
      $("#active").val(activeList[0]);
    }

    $("#show-main-loader").css("display", "none");
  });
}

function downloadPrescription(filterObj) {
  let payloadId = appointmentId;
  downloadPdf(
    "appointmentDetails",
    payloadId,
    null,
    patientName,
    function (result, error) {
      if (error) console.log(error);
      if (result) {
        showToastMessage(result.message, "info");
      }
      // if (result.data.length == 0) showToastMessage(result.message, "info");
    }
  );
}
function downloadBill(filterObj) {
  let payloadId = appointmentId;
  downloadBillDocument(
    "appointmentBills",
    payloadId,
    null,
    patientName,
    function (result, error) {
      if (error) console.log(error);
      if (result) {
        showToastMessage(result.message, "info");
      }
      // if (result.data.length == 0) showToastMessage(result.message, "info");
    }
  );
}
let patientName = "";

function previewPrescription(...data) {
  console.log("data to view ", data);

  let [doctorInfo, patientInfo, date, appointment_id, prescriptions, slotTime] =
    data;
  let prescriptionResponse = JSON.parse(prescriptions);
  console.log(
    "detail--",
    doctorInfo,
    patientInfo,
    date,
    appointment_id,
    prescriptions
  );

  patientName = `${patientInfo.split("-")[0]}`;
  let patientData = patientInfo.split(" - ");
  console.log("----", patientInfo, "-------", patientData);

  doctorName = `${doctorInfo.split("-")[0]}`;
  doctorSpecialization = `${doctorInfo.split("-")[1]}`;
  let doctorData = doctorInfo.split(" - ");
  console.log("----", doctorInfo, "-------", doctorData);

  $("#previewDate").text(formatDate(new Date()));
  $("#previewClinicName").text("Serenity Clinic");
  $("#previewClinicAddress").text("123 Main Street, Shimoga, Karnataka");
  $("#previewPhone").text("+91 98765 43210");
  $("#previewEmail").text("info@serenityclinic.com");
  $("#previewGender").text(patientData[1]);
  $("#previewAppointmentDate").text(formatDate(new Date(date)));
  $("#previewAge").text(
    calculateAge(
      patientData[patientData.length - 1]
        .replace("(", "")
        .replace(")", "")
        .trim()
    )
  );
  $("#previewPatientName").text(patientName);
  $("#previewDoctorName").text(doctorName);
  $("#previewDoctorSpecialization").text(doctorSpecialization);
  $("#previewDoctorSign").text(doctorName);
  $("#previewDoctorSignSpecialization").text(doctorSpecialization);

  $("#previewSlotTime").text(slotTime);
  let testStr = "";
  if (prescriptionResponse.investigations.length > 0)
    for (let item of prescriptionResponse.investigations) {
      testStr += `<li>${item.testName}- ${item.result}</li>`;
      //
    }
  $("#previewTests").append(testStr);

  $("#previewDiagnosis").text(prescriptionResponse.diagnosis);
  $("#previewFollowUpDate").text(
    formatDate(new Date(prescriptionResponse.followUpDate))
  );
  $("#previewFinalNotes").text(prescriptionResponse.notes);

  let medicineStr = "";
  if (prescriptionResponse.medicine.length > 0)
    for (let item of prescriptionResponse.medicine) {
      medicineStr += `<li>${item.name} - ${item.quantity} tablets, ${item.doses} (${item.time}), ${item.haveIt}</li>`;
    }
  $("#previewMedicines").append(medicineStr);
  appointmentId = appointment_id;
}

function previewBill(...data) {
  let [
    doctorInfo,
    patientInfo,
    patientAddress,
    date,
    appointment_id,
    prescriptions,
    consultationFees,
  ] = data;
  patientName = `${patientInfo.split("-")[0]}`;
  appointmentId = appointment_id;

  let prescriptionResponse = JSON.parse(prescriptions);
  console.log(
    "detail--",
    doctorInfo,
    patientInfo,
    patientAddress,
    date,
    appointment_id,
    prescriptions
  );

  let patientFirstName = `INV_${patientName.split(" ")[0]}`;
  let invoiceNo = `${patientFirstName}_${randomData(6)}`;

  console.log("patientName ----------", prescriptionResponse);

  $("#billInvoiceDate").text(formatDate(new Date()));
  $(".billClinicName").text("Serenity Clinic");
  $("#billClinicAddress").text("123 Main Street, Shimoga, Karnataka");
  $("#billPhone").text("+91 98765 43210");
  $("#billEmail").text("info@serenityclinic.com");
  $("#billInvoiceNo").text(invoiceNo);
  $("#billTo").text(patientName);
  $("#billDueDate").text(
    formatDate(new Date(prescriptionResponse.followUpDate))
  );
  $("#billPaymentMethod").text("Cash/UPI");
  $("#billAddress").text(patientAddress);
  $("#billWebsite").text("www.serenityclinic.com");

  //

  let taxOnFees = (5 / 100) * consultationFees;
  // console.log("taxFees", taxOnFees);
  let itemList = [
    {
      description: "Consulation Fees",
      quantity: 1,
      unitPrice: consultationFees - taxOnFees,
      tax: taxOnFees,
      total: consultationFees,
    },
  ];
  // console.log("first item", JSON.stringify(itemList));

  let totalTax = taxOnFees;
  let subTotal = consultationFees - taxOnFees;
  let grandTotal = parseInt(consultationFees);
  // console.log(
  // 	"first item with tax cusn",
  // 	totalTax,
  // 	subTotal,
  // 	grandTotal,
  // );

  if (prescriptionResponse.investigations.length > 0)
    for (let it of prescriptionResponse.investigations) {
      // {
      // 		  "testName": "Vitamin B12",
      // 		  "result": "nearest to theshold point",
      // 		  "cost": 250,
      // 		  "_id": "68ce98c251dac9e018ba21bc"
      // 		},
      let tax = (5 / 100) * it.cost;
      totalTax += tax;
      grandTotal += parseInt(it.cost);
      subTotal += it.cost - tax;
      itemList.push({
        description: it.testName,
        quantity: 1,
        unitPrice: it.cost - tax,
        tax,
        total: it.cost,
      });
    }
  // console.log("item after testarray loop", JSON.stringify(itemList));
  if (prescriptionResponse.medicine.length > 0)
    for (let it of prescriptionResponse.medicine) {
      // 		{
      // 		  "name": "Paracetamol 500mg",
      // 		  "quantity": "20",
      // 		  "doses": "TWO",
      // 		  "time": "MORNING-NIGHT",
      // 		  "haveIt": "AFTER-FOOD",
      // 		  "cost": 80,
      // 		  "_id": "68ce98c251dac9e018ba21c3"
      // 		}
      let tax = (5 / 100) * it.cost;
      totalTax += tax;
      grandTotal += parseInt(it.cost);
      subTotal += it.cost - tax;
      itemList.push({
        description: it.name,
        quantity: it.quantity,
        unitPrice: it.cost - tax,
        tax,
        total: it.cost,
      });
    }
  console.log("item after medicine loop", JSON.stringify(itemList), grandTotal);

  let discount = Math.round(0.05 * parseInt(grandTotal));
  console.log("Discount after All loop", discount);
  let itemStr = "";
  for (let item of itemList) {
    itemStr += `<tr>
                        <td><span>${item.description}</span></td>
                        <td>${item.quantity}</td>
                        <td>${item.unitPrice}</td>
                        <td>${item.tax}</td>
                        <td>${item.total}</td>
                      </tr>`;
  }
  $("#billInvoiceItems").append(itemStr);
  $("#billSubTotal").text(subTotal);
  $("#billTotalTax").text(totalTax);
  $("#billTotalDiscount").text(discount);
  $("#billGrandTotal").text(grandTotal - discount);
}
function getAppointmentList(filterObj) {
  let filterList = {};

  if (filterObj) {
    for (let item in filterObj) filterList[item] = filterObj[item];
  }
  if (localStorage.getItem("role") == "PATIENT") {
    filterList["patientId"] = localStorage.getItem("userId");
  }
  $("#tableList").html("");

  $("#show-main-loader").css("display", "block");
  $("#showTableDesc").html("Appointment List");
  getDataList("appointments", null, filterList, function (result, error) {
    if (error) console.log(error);

    if (result.data.length == 0) showToastMessage(result.message, "info");

    let str = "";
    // let loggedInRole = localStorage.getItem("role");
    let finalList = result.data;
    console.log({ finalList });

    for (let it of finalList) {
      let doctorInfo = `${it.doctorId.firstName} ${it.doctorId.lastName} - ${it.doctorId.specialization}`;
      /*   >Name - Gender - Date of Birth - Blood Group</  */

      let patientInfo = `${it.patientId.firstName} ${it.patientId.lastName} - ${
        it.patientId.gender
      } - ( ${formatDate(new Date(it.patientId.dateOfBirth))} )`;
      const prescriptionStr = JSON.stringify(it.prescription).replace(
        /"/g,
        "&quot;"
      ); // escape double quotes
      let patientAddress = it.patientId.address;

      appointmentId = it._id;
      // count = count + 1;

      /*
							<th>Date</th>
							<th>Patient Name - DOB</th>
							<th>Doctor Name - Specialization</th>
							<th>Slot</th>
							<th>Reason to visit</th>
							<th>Status</th>
							<th>Action</th>
			*/
      str += `<tr>
                    <td>
                    ${formatDate(new Date(it.date))}</td>
                    <td>${it.patientId.firstName} ${
        it.patientId.lastName
      } - ${formatDate(new Date(it.patientId.dateOfBirth))}</td>
                    <td>${it.doctorId.firstName} ${it.doctorId.lastName}
			</td>
                    
                    
					
            <td>${it.slots.slot}</td>
			<td>${it.reason}</td>
			<td>${it.status}</td>
                    
                    
                <td><span style="cursor:pointer;color:#48bf36;padding:5px;margin:5px;font-size:16px;" onclick="viewData('${
                  it.doctorId.firstName
                } ${it.doctorId.lastName}','${it.date}','${it.startTime}','${
        it.endTime
      }','${it.duration}','${
        it.slots
      }')"><i class="fa fa-eye" aria-hidden="true"></i>

                </span><span style="cursor:pointer;color:#48bf36;padding:5px;margin:5px;font-size:16px;" onclick="showData('${
                  it.doctorId.firstName
                } ${it.doctorId.lastName}','${it.date}','${it.startTime}','${
        it.endTime
      }','${it.duration}','${
        it.slots
      }')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                </span>
				</span><span style="cursor:pointer;color:#2c52ed;padding:5px;margin:5px;font-size:20px;" onclick="writePrescription('${doctorInfo}','${patientInfo}','${
        it.date
      }', '${
        it._id
      }', '${prescriptionStr}')"><i class="fa fa-file-text-o" aria-hidden="true"></i>
                </span>
				<span style="cursor:pointer;color:#2c52ed;padding:5px;margin:5px;font-size:20px;" data-toggle="modal"
						data-target="#billModal" onclick="previewBill('${doctorInfo}','${patientInfo}','${patientAddress}','${
        it.date
      }', '${it._id}', '${prescriptionStr}','${
        it.consultationFees
      }')"><i class="fa fa-inr" aria-hidden="true"></i>
                </span>
				

				<span><button
						
						type="button"
						class="anchor-tag"
						data-toggle="modal"
						data-target="#previewModal"
						onclick="previewPrescription('${doctorInfo}','${patientInfo}','${it.date}', '${
        it._id
      }', '${prescriptionStr}','${it.slots.slot}')">
						preview
					</button></span></td></tr>`;
    }

    // str +=`<tr><td>Total Amount</td><td>${response.data.totalAmount}</tr>`
    $("#tableList").append(str);
    if (!$("#active").val()) {
      $("#active").empty();

      for (let item of activeList) {
        // let selectedYear = item == todayDate[2] ? true : false;
        $("#active").append($(`<option>`).val(item).text(item));
      }
      $("#active").val(activeList[0]);
    }

    $("#show-main-loader").css("display", "none");
  });
}

function onRoleChange(event) {
  let value = event.target.value;
  console.log(value);
  if (value === "DOCTOR") $("#isDoctor").css("display", "block");
  else $("#isDoctor").css("display", "none");
}
function register() {
  //let active = Boolean(document.getElementById("active-check").value);
  console.log("dates", document.getElementById("dates").value);

  let obj = {
    doctorId: localStorage.getItem("doctorId"),
    patientId: document.getElementById("patients").value.trim(),
    slots: {
      slot: document.getElementById("selectedSlot").value.trim(),
      slotId: selectedSLotId,
    },
    date: new Date(JSON.parse(document.getElementById("dates").value).date),
    reason: document.getElementById("reason").value.trim(),
    consultationFees: parseInt($("#consultationsFee").val()),
  };
  console.log("obejct to pass crate appointment", obj);
  let isFormValid = formValidation(obj);
  if (!isFormValid) return false;

  $("#register-loader").css("visibility", "visible");

  postData("appointments", obj, null, null, function (result, error) {
    if (error) console.log(error);
    console.log({ "data received from": result });
    $("#register-loader").css("visibility", "hidden");
    showToastMessage(result.message, "success");
    $("#registerClient").trigger("reset");
    $("#myModal").modal("hide");
    // getUserList();
    setTimeout(() => {
      getAppointmentList();
      // getSlotList();
    }, 2000);
  });
}

function updatePrescription() {
  console.log({ message: "adad", appointmentId });

  //let active = Boolean(document.getElementById("active-check").value);
  console.log("dates", document.getElementById("dates").value);
  let finalMedicineList = addMedicineList.map(({ _id, ...rest }) => rest);
  let finalTestList = addedInvestigation.map(({ _id, ...rest }) => rest);
  let obj = {
    prescription: {
      diagnosis: $("#diagnosis").val(),
      medicine: finalMedicineList,
      investigations: finalTestList,
      followUpDate: $("#followUpDate").val(),
      notes: $("#notes").val(),
    },
  };
  console.log("obejct to pass crate appointment", obj);
  let isFormValid = formValidation(obj);
  if (!isFormValid) return false;

  $("#register-loader").css("visibility", "visible");

  patchData("appointments", obj, null, appointmentId, function (result, error) {
    if (error) console.log(error);
    console.log({ "data received from": result });
    $("#register-loader").css("visibility", "hidden");
    showToastMessage(result.message, "success");
    $("#registerClient").trigger("reset");
    $("#presModal").modal("hide");
    setTimeout(() => {
      getAppointmentList();
    }, 2000);
  });
}

function updatePrescriptionCost() {
  console.log({ message: "adad", appointmentId });

  //let active = Boolean(document.getElementById("active-check").value);
  let finalMedicineList = addMedicineList.map(({ _id, ...rest }) => rest);
  let finalTestList = addedInvestigation.map(({ _id, ...rest }) => rest);
  let obj = {
    prescription: {
      medicine: finalMedicineList,
      investigations: finalTestList,
    },
  };
  console.log("obejct to pass crate appointment", obj);
  let isFormValid = formValidation(obj);
  if (!isFormValid) return false;

  $("#register-loader").css("visibility", "visible");

  patchData(
    "prescriptionCost",
    obj,
    null,
    appointmentId,
    function (result, error) {
      if (error) console.log(error);
      console.log({ "data received from": result });
      $("#register-loader").css("visibility", "hidden");
      showToastMessage(result.message, "success");
      $("#registerClient").trigger("reset");
      $("#billGenerationModal").modal("hide");
      // getUserList();
      setTimeout(() => {
        getAppointmentList();
        // getSlotList();
      }, 2000);
    }
  );
}
function addExperience() {
  if (expList.length == 3) {
    showErrorMessage("Limit reached for experience", true);
    return;
  }

  let hospital = $("#hospital").val();
  let expYear = $("#expYears").val();
  console.log(hospital, expYear);
  expList.push({ hospitalName: hospital, years: expYear });
  let str = `<div class="form-group col-md-4">
												<label for="expYear"></label>
												<input
													type="text"
													autocomplete="false"
													class="form-control"
													value="${hospital}-${expYear}"
													readonly />
											</div>`;

  $("#addExp").append(str);
}

function closeUserModal() {
  $("#registerClient").trigger("reset");
  $("#display-message").css("visibility", "hidden");
  $("#salary").val("");
  // $("#month").val(todayDate[0]);
  // $("#year").val(todayDate[2]);
  // $("#day").val(todayDate[1]);
  $("#active-check").prop("checked", true);
  $("#active-check").prop("disabled", false);
  $("#role").prop("disabled", false);
}
$("#active").on("change", function () {
  let activeState = $("#active").val();
  let obj = {};
  if (activeState == "ACTIVE") obj["active"] = true;
  else obj["active"] = false;
  getUserList(obj);
});
