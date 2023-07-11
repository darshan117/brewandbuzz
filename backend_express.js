const express = require("express");
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
// ------------------
//Create a campaign\
// ------------------
// Include the Brevo library\
const nodemailer = require("nodemailer");
const newtp = "time pass"
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 587,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'info@brewandbuzz.com',
    pass: process.env.GMAIL_PASS
  }
});


//mail gen
var Mailgen = require('mailgen');

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Brew and Buzz template',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


  app.use(express.json())
app.post("/path/to/server", (req, res) => {
  const sliderData = req.body;
  // Extract the slider values from the request body
  console.log(sliderData); // Do whatever you want with the data
  
  res.sendStatus(200); // S
  newfunc(sliderData);
});
let name_client;
let email_id;
let last_name;
let phone_number;
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/submit-form", (req, res) => {
  name_client = req.body.name;
  last_name = req.body.lastname;
  email_id = req.body.emailid;
  phone_number= req.body.mobile_number;
  // Extract the slider values from the request body
  console.log(name_client+" " +email_id); // Do whatever you want with the data
  
  res.sendStatus(200); 
});











// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: "brewandbuzz-889@smoke-test-383702.iam.gserviceaccount.com",
  key: process.env.PASS_KEY,
     scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

async function newfunc(data){
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
await doc.loadInfo(); // loads document properties and worksheets
await doc.updateProperties({ title: 'Client doc' });
tableData =[]
const sheet = await doc.addSheet({ headerValues: ['Service', 'Qty'],title: `${name_client}`});

  const keys= Object.keys(data)
  for (const key of keys) {
    const value = data[key];
    const newval = value.replace("  ","").replaceAll("\n","");
    value_string = newval.split(" ")[0]
    if(value_string!="0"){
    tableData.push({
        "Service":key,
        "Qty":value_string
    })
    
    const larryRow = await sheet.addRow({Service:`${key}`,Qty:`${newval.split(" ")[0]}`});}
    // Do something with the value
    // ...
  };
await sheet.addRow({Service:" ",Qty:""})
await sheet.addRow({Service:"Form Details ",Qty:""})
await sheet.addRow({Service:"EmailId ",Qty:`${email_id}`})
await sheet.addRow({Service:"Phone Number ",Qty:`${phone_number}`})
await sheet.addRow({Service:"Name",Qty:`${name_client}`})
  console.log(tableData)

  let tableRows = '';
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    tableRows += `
      <tr>
        <td>${row.Service}</td>
        <td>${row.Qty}</td>
      </tr>
    `;
  }
var email = {
    body: {
        name: 'Client Name',
        intro: 'Welcome to Brew and buzz! We\'re very excited to have you on board.',
        table: {
            data: {
            rows:tableData.map(row => {row.Service, row.Qty})
            },
            columns: {
                // Optionally, customize the column widths
                customWidth: {
                    Service: '20%',
                    Qty: '15%'
                },
                // Optionally, change column text alignment
                customAlignment: {
                    Qty: 'right'
                }
            }
          },
        
        action: {
            instructions: 'To get started with Mailgen, please click here:',
                     
                button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};
var newemail = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS for the card-type body */
    .card {
      background-color: #f8f8f8;
      border-radius: 8px;
      padding: 20px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #333;
    }
    
    /* CSS for the table */
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    .table th,
    .table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .table th {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Welcome to Brew and Buzz .We're very exicted to have you on board</h2>
    
    <table class="table">
    ${tableRows}
    </table>
    
    <p>Thank you for your order.</p>
  </div>
</body>
</html>

`
// Generate an HTML email with the provided contents
var emailBody = mailGenerator.generatePlaintext(email);

const mailOptions = {
    from: '"Brew and buzz" <info@brewandbuzz.com>', // sender address
    to: `${email_id},darshangaikwad117@gmail.com`, // list of receivers
    cc:"brewandbuzz@gmail.com",
    subject: "This is a Test Mail ✔", // Subject line
    text: "Quotation", // plain text body
    html: newemail, // html body
  }

const info = transporter.sendMail(mailOptions).then(()=>{
    console.log("sent successfully")
}).catch(error=>{
    console.log(error)
})

}

// append rows
// This is a middleware to parse the json object

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
