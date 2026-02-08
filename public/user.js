// console.log('admin page js');
let empList = [];
let typeList = ["GENERAL", "TRAVEL", "FOOD", "STATIONARY", "TOOLS"];
let activeList = ["ACTIVE", "INACTIVE"];
let todayDate = new Date()
  .toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  .replace(",", "")
  .split(" ");
console.log({ todayDate });
let dayList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
];
let role = localStorage.getItem("role");
let roleList = [];
if (role == "ADMIN") roleList = ["RECEPTIONIST", "DOCTOR", "ADMIN"];
else if (role == "RECEPTIONIST") roleList = ["PATIENT"];

let yearList = [];
for (let i = 1950; i <= new Date().getFullYear(); i++) {
  yearList.push(i);
}

let monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let bloodGroupList = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
let gender = ["MALE", "FEMALE", "OTHER"];
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
(function () {
  if (!localStorage.getItem("token")) window.location.href = "/login";
  $("#setName").text(`Hi ${localStorage.getItem("name")}`);
  let role = localStorage.getItem("role");
  $("#setRole").text(role);
  // if (role != "RECEPTIONIST" && role != "DOCTOR" ) {
  // 	$("#showSlotMenu").css("display", "none");
  // } else {
  // 	$("#showSlotMenu").css("display", "block");
  // }
    if(role=="ADMIN"){
		$("#showAppointmentMenu").css("display","none")
	}

  if (role === "ADMIN" || role === "PATIENT") {
    $("#showSlotMenu").css("display", "none");
  } else {
    $("#showSlotMenu").css("display", "block");
  }
  if (role != "DOCTOR" && role != "PATIENT") {
    $("#showSlotAdd").css("display", "block");
  } else {
    $("#showSlotAdd").css("display", "none");
  }
  //  showToastMessage('Welcome to Client Page','info',true);
  getUserList();
})();

function showData(...data) {
  console.log("data to view ", data);

  $("#myModal").modal("show");
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

  for (let item of monthList) {
    $("#month").append($(`<option>`).val(item).text(item));
  }
  for (let item of qualificationList) {
    $("#qualification").append($(`<option>`).val(item).text(item));
  }

  for (let item of bloodGroupList) {
    $("#bloodGroup").append($(`<option>`).val(item).text(item));
  }
  for (let item of hospital) {
    $("#hospital").append($(`<option>`).val(item).text(item));
  }
  for (let item of experience) {
    $("#expYears").append($(`<option>`).val(item).text(item));
  }
  for (let item of gender) {
    $("#gender").append($(`<option>`).val(item).text(item));
  }
  for (let item of specializationList) {
    $("#specialization").append($(`<option>`).val(item).text(item));
  }
  for (let item of yearList) {
    // let selectedYear = item == todayDate[2] ? true : false;
    $("#year").append($(`<option>`).val(item).text(item));
  }
  for (let item of roleList) {
    // let selectedYear = item == todayDate[2] ? true : false;
    $("#role").append($(`<option>`).val(item).text(item));
  }

  for (let item of dayList) {
    let option = item < 10 ? `0${item}` : item;

    $("#day").append($(`<option>`).val(option).text(option));
  }

  $("#role").attr("disabled", true);
  $("#active-check").prop("checked", active);
}
function viewData(...data) {
  console.log("data to view ", data);

  $("#myModal").modal("show");
  $("#addbtn").css("display", "none");
  $("#updatebtn").css("display", "none");

  $("#year").empty();
  $("#year").prop("disabled", true);
  $("#month").empty();
  $("#month").prop("disabled", true);
  $("#day").empty();
  $("#day").prop("disabled", true);
  $("#active-check").prop("checked", active);
  $("#active-check").prop("disabled", true);
  for (let item of monthList) {
    $("#month").append($(`<option>`).val(item).text(item));
  }
  for (let item of qualificationList) {
    $("#qualification").append($(`<option>`).val(item).text(item));
  }
  for (let item of bloodGroupList) {
    $("#bloodGroup").append($(`<option>`).val(item).text(item));
  }
  for (let item of gender) {
    $("#gender").append($(`<option>`).val(item).text(item));
  }
  for (let item of specializationList) {
    $("#specialization").append($(`<option>`).val(item).text(item));
  }
  for (let item of yearList) {
    // let selectedYear = item == todayDate[2] ? true : false;
    $("#year").append($(`<option>`).val(item).text(item));
  }
  for (let item of roleList) {
    // let selectedYear = item == todayDate[2] ? true : false;
    $("#role").append($(`<option>`).val(item).text(item));
  }
  for (let item of hospital) {
    $("#hospital").append($(`<option>`).val(item).text(item));
  }
  for (let item of experience) {
    $("#expYears").append($(`<option>`).val(item).text(item));
  }
  for (let item of dayList) {
    let option = item < 10 ? `0${item}` : item;

    $("#day").append($(`<option>`).val(option).text(option));
  }

  $("#role").attr("disabled", true);
}

function showModalWithSelect(data) {
  console.log("showmodle with select", data);
  document.getElementById("qualification").innerHTML = "";
  document.getElementById("bloodGroup").innerHTML = "";
  document.getElementById("gender").innerHTML = "";
  document.getElementById("specialization").innerHTML = "";
  document.getElementById("role").innerHTML = "";
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

  for (let item of monthList) {
    $("#month").append($(`<option>`).val(item).text(item));
  }
  for (let item of qualificationList) {
    $("#qualification").append($(`<option>`).val(item).text(item));
  }
  for (let item of yearList) {
    let selectedYear = item == todayDate[2] ? true : false;
    $("#year").append($(`<option>`).val(item).text(item));
  }
  for (let item of bloodGroupList) {
    $("#bloodGroup").append($(`<option>`).val(item).text(item));
  }
  for (let item of gender) {
    $("#gender").append($(`<option>`).val(item).text(item));
  }
  for (let item of specializationList) {
    $("#specialization").append($(`<option>`).val(item).text(item));
  }
  for (let item of hospital) {
    $("#hospital").append($(`<option>`).val(item).text(item));
  }
  for (let item of experience) {
    $("#expYears").append($(`<option>`).val(item).text(item));
  }

  for (let item of dayList) {
    let option = item < 10 ? `0${item}` : item;

    $("#day").append($(`<option>`).val(option).text(option));
  }
  for (let item of roleList) {
    $("#role").append($(`<option>`).val(item).text(item));
  }
  $("#role").prop("disabled", false);

  $("#month").val(todayDate[0]);
  $("#year").val(todayDate[2]);
  $("#day").val(todayDate[1] < 10 ? `0${todayDate[1]}` : todayDate[1]);
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
  $("#tableList").html("");

  $("#show-main-loader").css("display", "block");
  $("#showTableDesc").html("User List");
  getDataList("users", null, filterList, function (result, error) {
    if (error) console.log(error);

    if (result.data.length == 0) showToastMessage(result.message, "info");

    let str = "";
    let loggedInRole = localStorage.getItem("role");
    let finalList = [];
    if (loggedInRole == "RECEPTIONIST") {
      let doctorList = result.data.filter((item) => item.role == "DOCTOR");
      // for (let it of doctorList) {
      // 	localStorage.setItem(
      // 		,
      // 		`${it.firstName} ${it.lastName} - ${it.specialization} - ${it.qualification} - ${it.consultationFee}`,
      // 	);
      // }
      localStorage.setItem("doctorList", doctorList.toString());
      finalList = result.data.filter((item) => item.role != "DOCTOR");
    } else {
      finalList = result.data;
    }
    for (let it of finalList) {
      // count = count + 1;
      str += `<tr>
                    <td>
                    ${it.userName}</td>
                    <td>${it.firstName} ${it.lastName}</td>
                    
                    
					
            <td>${it.phone}</td>
			<td>${it.gender}</td>
			<td>${it.bloodGroup}</td>
            <td>${it.role}</td>
			<td>${it.status}</td>
            <td>${
              !it.active
                ? '<span style="color:#48bf36; font-size:16px;text-align:center;"onclick=""><i class="fa fa-circle" aria-hidden="true"></i></span>'
                : '<span style="color:#FF4949; font-size:16px;text-align:center;" onclick=""><i class="fa fa-circle" aria-hidden="true"></i></span>'
            }</td>
            
                    
                    
                <td><span style="cursor:pointer;color:#48bf36;padding:5px;margin:5px;font-size:16px;" onclick="viewData('${
                  it.firstName
                }','${it.lastName}','${it.userName}','${it.email}','${
        it.salary
      }','${it.phone}','${it.address}',${it.active},'${it.year}','${
        it.month
      }','${it.day}','${it.role}')"><i class="fa fa-eye" aria-hidden="true"></i>

                </span>${
                  it.active && it.role == "EMPLOYEE"
                    ? `<span style="cursor:pointer;color:#FF4949;padding:5px;margin:5px; font-size:16px;"onclick="showToastConfirmMessage('Are you sure want to delete ?','error','${it.userName}');"><i class="fa fa-trash-o" aria-hidden="true"></i></span>`
                    : `<span style="cursor:pointer;color:#48bf36;padding:5px;margin:5px; font-size:16px;visibility:hidden" onclick=""><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>`
                }<span style="cursor:pointer;color:#48bf36;padding:5px;margin:5px;font-size:16px;" onclick="showData('${
        it.firstName
      }','${it.lastName}','${it.userName}','${it.email}','${it.salary}','${
        it.phone
      }','${it.address}',${it.active},'${it.year}','${it.month}','${it.day}','${
        it.role
      }')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                </span></td></tr>`;
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
function deleteData() {
  $("#delete-loader").css("visibility", "visible");
  let params = $("#dataToDelete").html();
  let obj = {
    active: false,
  };
  // $('#register-loader').css('visibility','visible');
  patchData("delete_employees", obj, null, params, function (result, error) {
    if (error) console.log(error);
    console.log({ "data received from": result });
    $("#delete-loader").css("visibility", "hidden");
    hideConfirmToast();
    showToastMessage(result.message, "success");

    setTimeout(() => {
      getUserList();
    }, 2000);
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
  let year = document.getElementById("year").value;
  let month = document.getElementById("month").value;
  let day = document.getElementById("day").value;
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  let role = document.getElementById("role").value;
  console.log("date of birth", year, month, day, new Date(year, month, day));

  let obj = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: "+91" + document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    bloodGroup: document.getElementById("bloodGroup").value.trim(),
    gender: document.getElementById("gender").value.trim(),
    dateOfBirth: new Date(year, monthIndex, day),

    role,
  };

  if (role == "DOCTOR") {
    obj["qualifications"] = $("#qualification").val();
    obj["specialization"] = $("#specialization").val();
    obj["experience"] = expList;
    obj["consultationFee"] = parseInt($("#consultationFee").val());
  }
  let isFormValid = formValidation(obj);
  if (!isFormValid) return false;

  $("#register-loader").css("visibility", "visible");

  postData("users", obj, null, null, function (result, error) {
    if (error) console.log(error);
    console.log({ "data received from": result });
    $("#register-loader").css("visibility", "hidden");
    showToastMessage(result.message, "success");
    $("#registerClient").trigger("reset");
    $("#myModal").modal("hide");
    // getUserList();
    setTimeout(() => {
      getUserList();
    }, 2000);
  });
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
  $("#month").val(todayDate[0]);
  $("#year").val(todayDate[2]);
  $("#day").val(todayDate[1]);
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
