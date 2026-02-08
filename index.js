const express = require("express");
const connectDB = require('./database.js')
const app = express();
app.use(express.json());
app.use(express.static("public"));
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
handlebars.RuntimeOptions = {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true,
};
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs"); // for date formatting
const CustomResponse = require("./src/utils/custom-response.js");
const CONSTANT = require("./src/utils/constant.js");
const UserService = require("./src/service/user-service.js");
const AppointmentService = require("./src/service/appointment-service.js");
const UserMiddleware = require("./src/middleware/user-middleware.js");
const Utility = require("./src/utils/utility.js");
require("dotenv").config();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Clinic Management API running' });
});

app.use("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

app.use("/user", (req, res) => {
  res.sendFile(__dirname + "/public/user.html");
});

app.use("/slot", (req, res) => {
  res.sendFile(__dirname + "/public/slot.html");
});

app.use("/appointment", (req, res) => {
  res.sendFile(__dirname + "/public/appointment.html");
});

app.use("/prescription", (req, res) => {
  res.sendFile(__dirname + "/public/prescription.html");
});

app.use("/users", require("./src/controller/user-controller.js"));
app.use("/slots", require("./src/controller/slot-controller.js"));
app.use("/appointments", require("./src/controller/appointment-controller.js"));
// app.use(
// 	"/prescriptions",
// 	require("./src/controller/prescription-controller.js"),
// );
// console.log(process.env);

app.get(
  "/download-pdf/:id",
  UserMiddleware.isAuthenticate,
  async (req, res) => {
    try {
      const appointmentId = req.params.id;
      AppointmentService.detail(req.user, appointmentId)
        .then(async (result) => {
          // console.log("response from detail", result);
          // {
          // 	slots: { slot: '2:30 PM', slotId: new ObjectId('68cabf770e9400a8e9f7ab68') },
          // 	prescription: {
          // 	  diagnosis: 'Fever',
          // 	  medicine: [ [Object] ],
          // 	  investigations: [ [Object], [Object] ],
          // 	  followUpDate: 2025-09-23T00:00:00.000Z,
          // 	  notes: ''
          // 	},
          // 	_id: new ObjectId('68cabfd60e9400a8e9f7abe9'),
          // 	patientId: {
          // 	  age: '',
          // 	  _id: new ObjectId('68bf1ccac2e153958e3beb3d'),
          // 	  firstName: 'Ganesh',
          // 	  lastName: 'SN',
          // 	  phone: '+917876567656',
          // 	  dateOfBirth: 2001-05-19T18:30:00.000Z,
          // 	  gender: 'MALE',
          // 	  address: 'Simoga, Karnataka',
          // 	  bloodGroup: 'O+',
          // 	  status: 'OPEN',
          // 	  experience: [],
          // 	  isActive: true,
          // 	  role: 'PATIENT',
          // 	  otp: null,
          // 	  createdAt: 2025-09-08T18:13:30.788Z,
          // 	  __v: 0
          // 	},
          // 	doctorId: {
          // 	  age: '',
          // 	  _id: new ObjectId('68bd61081699376b0b647ba2'),
          // 	  firstName: 'Sree',
          // 	  lastName: 'Vidya',
          // 	  phone: '+918790987896',
          // 	  dateOfBirth: 1998-04-02T18:30:00.000Z,
          // 	  gender: 'FEMALE',
          // 	  address: 'Hindupur Andhra',
          // 	  bloodGroup: 'B+',
          // 	  email: 'sreevidya@gmail.com',
          // 	  status: 'OPEN',
          // 	  specialization: 'Cardiologist',
          // 	  qualifications: 'MS (Master of Surgery)',
          // 	  experience: [ [Object], [Object] ],
          // 	  consultationFee: 2000,
          // 	  isActive: true,
          // 	  role: 'DOCTOR',
          // 	  otp: null,
          // 	  createdAt: 2025-09-07T10:40:08.110Z,
          // 	  __v: 0
          // 	},
          // 	date: 2025-09-19T00:00:00.000Z,
          // 	status: 'INPROGRESS',
          // 	reason: 'General Checkup',
          // 	createdAt: 2025-09-17T14:04:06.862Z,
          // 	updatedAt: 2025-09-17T16:10:24.660Z,
          // 	__v: 0
          //   }
          const data = {
            clinicName: "Serenity Clinic",
            clinicAddress: "123 Main Street, Shimoga, Karnataka",
            phone: "+91 98765 43210",
            email: "info@serenityclinic.com",

            patientName: `${result.patientId.firstName} ${result.patientId.lastName}`,
            age: dayjs().diff(dayjs(result.patientId.dateOfBirth), "year"),
            gender: result.patientId.gender.toLowerCase(),
            appointOn: dayjs(result.date).format("DD MMM YYYY"),
            date: dayjs(new Date()).format("DD MMM YYYY"),

            doctorName: `${result.doctorId.firstName} ${result.doctorId.lastName}`,
            specialization: `${result.doctorId.qualifications}, (${result.doctorId.specialization})`,

            slot: result.slots.slot,

            diagnosis: result.prescription.diagnosis,
            medicines: result.prescription.medicine,
            investigations: result.prescription.investigations,
            followUpDate: dayjs(result.prescription.followUpDate).format(
              "DD MMM YYYY",
            ),
            notes: result.prescription.notes || "N/A",
          };
          // const data = {
          // 	companyName: "City Care Clinic",
          // 	companyAddress: "123 Health Street, New Delhi, India",
          // 	phone: "+91 9876543210",
          // 	email: "info@citycareclinic.com",
          // 	website: "www.citycareclinic.com",

          // 	invoiceNo: "INV-2025-001",
          // 	invoiceDate: "2025-09-19",
          // 	dueDate: "2025-09-25",
          // 	paymentMethod: "Credit Card",

          // 	customerName: "John Doe",
          // 	customerAddress: "45 Green Park, New Delhi, India",

          // 	items: [
          // 		{
          // 			description: "General Consultation",
          // 			quantity: 1,
          // 			unitPrice: "₹500",
          // 			tax: "₹50",
          // 			total: "₹550",
          // 		},
          // 		{
          // 			description: "Blood Test (CBC)",
          // 			quantity: 1,
          // 			unitPrice: "₹800",
          // 			tax: "₹80",
          // 			total: "₹880",
          // 		},
          // 		{
          // 			description: "Paracetamol 500mg",
          // 			quantity: 10,
          // 			unitPrice: "₹5",
          // 			tax: "₹5",
          // 			total: "₹55",
          // 		},
          // 	],

          // 	subtotal: "₹1,355",
          // 	taxTotal: "₹135",
          // 	discount: "₹50",
          // 	grandTotal: "₹1,440",
          // };

          console.log(JSON.stringify(data));

          // Compile Handlebars template
          const templatePath = path.join(__dirname, "prescription.hbs");
          const source = fs.readFileSync(templatePath, "utf-8");
          const template = handlebars.compile(source);
          const html = template(data, {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
          });

          // Generate PDF with Puppeteer
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setContent(html, { waitUntil: "networkidle0" });

          const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
          });
          await browser.close();

          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=prescription.pdf",
          });
          res.send(pdfBuffer);
          // res.send("hello");
        })
        .catch((error) => {});
      // Transform request object into template data
    } catch (err) {
      console.error(err);
      res.status(500).send("Error generating PDF");
    }
  },
);
app.get(
  "/download-bill/:id",
  UserMiddleware.isAuthenticate,
  async (req, res) => {
    try {
      const appointmentId = req.params.id;
      AppointmentService.detail(req.user, appointmentId)
        .then(async (result) => {
          // console.log("response from detail", JSON.stringify(result));
          // {
          // 	"slots": {
          // 	  "slot": "11:00 AM",
          // 	  "slotId": "68cd8268b2054af66b0646de"
          // 	},
          // 	"prescription": {
          // 	  "diagnosis": "Fever",
          // 	  "medicine": [
          // 		{
          // 		  "name": "Dolo 650mg",
          // 		  "quantity": "2",
          // 		  "doses": "TWO",
          // 		  "time": "MORNING-NIGHT",
          // 		  "haveIt": "AFTER-FOOD",
          // 		  "cost": 4,
          // 		  "_id": "68ce98c251dac9e018ba21be"
          // 		},
          // 		{
          // 		  "name": "Vitamin D capsule",
          // 		  "quantity": "10",
          // 		  "doses": "ONE",
          // 		  "time": "AFTERNOON",
          // 		  "haveIt": "AFTER-FOOD",
          // 		  "cost": 40,
          // 		  "_id": "68ce98c251dac9e018ba21bf"
          // 		},
          // 		{
          // 		  "name": "Vitamin B-complex capsule",
          // 		  "quantity": "20",
          // 		  "doses": "TWO",
          // 		  "time": "MORNING-NIGHT",
          // 		  "haveIt": "AFTER-FOOD",
          // 		  "cost": 20,
          // 		  "_id": "68ce98c251dac9e018ba21c0"
          // 		},
          // 		{
          // 		  "name": "Iron capsule",
          // 		  "quantity": "20",
          // 		  "doses": "TWO",
          // 		  "time": "MORNING-NIGHT",
          // 		  "haveIt": "AFTER-FOOD",
          // 		  "cost": 80,
          // 		  "_id": "68ce98c251dac9e018ba21c1"
          // 		},
          // 		{
          // 		  "name": "Dexorange",
          // 		  "quantity": "1",
          // 		  "doses": "ONE",
          // 		  "time": "NIGHT",
          // 		  "haveIt": "AFTER-FOOD",
          // 		  "cost": 20,
          // 		  "_id": "68ce98c251dac9e018ba21c2"
          // 		},
          // 		{
          // 		  "name": "Paracetamol 500mg",
          // 		  "quantity": "20",
          // 		  "doses": "TWO",
          // 		  "time": "MORNING-NIGHT",
          // 		  "haveIt": "AFTER-FOOD",
          // 		  "cost": 80,
          // 		  "_id": "68ce98c251dac9e018ba21c3"
          // 		}
          // 	  ],
          // 	  "investigations": [
          // 		{
          // 		  "testName": "Complete Blood Count (CBC)",
          // 		  "result": "Normal",
          // 		  "cost": 300,
          // 		  "_id": "68ce98c251dac9e018ba21b9"
          // 		},
          // 		{
          // 		  "testName": "Lipid Profile",
          // 		  "result": "Normal",
          // 		  "cost": 100,
          // 		  "_id": "68ce98c251dac9e018ba21ba"
          // 		},
          // 		{
          // 		  "testName": "Hemoglobin (Hb)",
          // 		  "result": "Low",
          // 		  "cost": 350,
          // 		  "_id": "68ce98c251dac9e018ba21bb"
          // 		},
          // 		{
          // 		  "testName": "Vitamin B12",
          // 		  "result": "nearest to theshold point",
          // 		  "cost": 250,
          // 		  "_id": "68ce98c251dac9e018ba21bc"
          // 		},
          // 		{
          // 		  "testName": "Vitamin D",
          // 		  "result": "worst",
          // 		  "cost": 3000,
          // 		  "_id": "68ce98c251dac9e018ba21bd"
          // 		}
          // 	  ],
          // 	  "followUpDate": "1970-01-01T00:00:00.000Z",
          // 	  "notes": "Fever with Vitamin D, Hemoglogobin and Vitamin B12 dificiency found"
          // 	},
          // 	"_id": "68cd8821dda04134cc17e180",
          // 	"patientId": {
          // 	  "_id": "68cd8240b2054af66b0646d5",
          // 	  "firstName": "syeda",
          // 	  "lastName": "Kulsum",
          // 	  "phone": "+919898787876",
          // 	  "dateOfBirth": "2000-12-06T18:30:00.000Z",
          // 	  "age": "",
          // 	  "gender": "FEMALE",
          // 	  "address": "Shimoga, Karnataka",
          // 	  "bloodGroup": "B+",
          // 	  "status": "OPEN",
          // 	  "experience": [],
          // 	  "isActive": true,
          // 	  "role": "PATIENT",
          // 	  "otp": null,
          // 	  "createdAt": "2025-09-19T16:18:08.936Z",
          // 	  "__v": 0
          // 	},
          // 	"doctorId": {
          // 	  "age": "",
          // 	  "_id": "68bd61081699376b0b647ba2",
          // 	  "firstName": "Sree",
          // 	  "lastName": "Vidya",
          // 	  "phone": "+918790987896",
          // 	  "dateOfBirth": "1998-04-02T18:30:00.000Z",
          // 	  "gender": "FEMALE",
          // 	  "address": "Hindupur Andhra",
          // 	  "bloodGroup": "B+",
          // 	  "email": "sreevidya@gmail.com",
          // 	  "status": "OPEN",
          // 	  "specialization": "Cardiologist",
          // 	  "qualifications": "MS (Master of Surgery)",
          // 	  "experience": [
          // 		{
          // 		  "hospitalName": "AIIMS, New Delhi",
          // 		  "years": "0-1 years",
          // 		  "_id": "68bd61081699376b0b647ba3"
          // 		},
          // 		{
          // 		  "hospitalName": "Apollo Hospitals, Chennai",
          // 		  "years": "1-2 years",
          // 		  "_id": "68bd61081699376b0b647ba4"
          // 		}
          // 	  ],
          // 	  "consultationFee": 2000,
          // 	  "isActive": true,
          // 	  "role": "DOCTOR",
          // 	  "otp": null,
          // 	  "createdAt": "2025-09-07T10:40:08.110Z",
          // 	  "__v": 0
          // 	},
          // 	"consultationFees": 2000,
          // 	"date": "2025-09-20T00:00:00.000Z",
          // 	"status": "COMPLETED",
          // 	"reason": "Fever",
          // 	"createdAt": "2025-09-19T16:43:13.332Z",
          // 	"updatedAt": "2025-09-20T12:06:26.552Z",
          // 	"__v": 0
          //   }
          let taxOnFees = (5 / 100) * result.consultationFees;
          // console.log("taxFees", taxOnFees);
          let itemList = [
            {
              description: "Consulation Fees",
              quantity: 1,
              unitPrice: result.consultationFees - taxOnFees,
              tax: taxOnFees,
              total: result.consultationFees,
            },
          ];
          // console.log("first item", JSON.stringify(itemList));

          let totalTax = taxOnFees;
          let subTotal = result.consultationFees - taxOnFees;
          let grandTotal = result.consultationFees;
          // console.log(
          // 	"first item with tax cusn",
          // 	totalTax,
          // 	subTotal,
          // 	grandTotal,
          // );

          if (result.prescription.investigations.length > 0)
            for (let it of result.prescription.investigations) {
              // {
              // 		  "testName": "Vitamin B12",
              // 		  "result": "nearest to theshold point",
              // 		  "cost": 250,
              // 		  "_id": "68ce98c251dac9e018ba21bc"
              // 		},
              let tax = (5 / 100) * it.cost;
              totalTax += tax;
              grandTotal += it.cost;
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
          if (result.prescription.medicine.length > 0)
            for (let it of result.prescription.medicine) {
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
              grandTotal += it.cost;
              subTotal += it.cost - tax;
              itemList.push({
                description: it.name,
                quantity: it.quantity,
                unitPrice: it.cost - tax,
                tax,
                total: it.cost,
              });
            }
          console.log("item after medicine loop", JSON.stringify(itemList));

          let discount = Math.round((5 / 100) * grandTotal);
          console.log("Discount after All loop", discount);

          const data = {
            clinicName: "Serinity Clinic",
            clinicAddress: "123 Main Street, Shimoga, Karnataka",
            phone: "+91 98765 43210",
            email: "info@ganeshkulsum.com",
            website: "www.serenityclinic.com",

            invoiceNo: `INV_${result.patientId.firstName}_${Utility.randomData(
              6,
            )}`,
            invoiceDate: Utility.formatDate(new Date()),
            dueDate: Utility.formatDate(
              new Date(result.prescription.followUpDate),
            ),
            paymentMethod: "Cash/UPI",

            customerName: `${result.patientId.firstName} ${result.patientId.lastName}`,
            customerAddress: result.patientId.address,

            items: itemList,

            subtotal: subTotal,
            taxTotal: totalTax,
            discount: discount,
            grandTotal: grandTotal - discount,
          };

          // console.log(JSON.stringify(data));

          // Compile Handlebars template
          const templatePath = path.join(__dirname, "invoice.hbs");
          const source = fs.readFileSync(templatePath, "utf-8");
          const template = handlebars.compile(source);
          const html = template(data, {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
          });

          // Generate PDF with Puppeteer
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setContent(html, { waitUntil: "networkidle0" });

          const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
          });
          await browser.close();

          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=invoice.pdf",
          });
          res.send(pdfBuffer);
          // res.send("hello");
        })
        .catch((error) => {});
      // Transform request object into template data
    } catch (err) {
      console.error(err);
      res.status(500).send("Error generating PDF");
    }
  },
);

app.use("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let adminPayload = {
  firstName: "ADMIN",
  lastName: "USER",
  phone: 8792315230,
  dateOfBirth: "1995-09-09",
  gender: "OTHER",
  bloodGroup: "A+",
  email: process.env.ADMIN_EMAIL,
  address: "Other",
  role: "ADMIN",
  userName: process.env.ADMIN_USER_NAME,
  password: process.env.ADMIN_PASSWORD,
};

UserService.register(adminPayload, undefined)
  .then((result) => {
    console.log(
      CustomResponse.success(
        CONSTANT.HTTP_STATUS.CREATED,
        CONSTANT.USER.REGISTER,
        result,
      ),
    );
  })
  .catch((error) => {
    console.log(
      CustomResponse.error(
        CONSTANT.HTTP_STATUS.INTERNAL_SERVER_ERROR,
        CONSTANT.COMMON.SERVER_ERROR,
        error,
      ),
    );
  });

async function startServer() {
  const dbConnected = await connectDB(); // Call imported function

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server started`);
  });
};

startServer();
