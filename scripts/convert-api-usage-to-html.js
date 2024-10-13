const fs = require('fs')
const path = require('path')
const apiUsagePath = path.join(__dirname, '..', 'reports', 'api-usage.json')
if (!fs.existsSync(apiUsagePath)) {
  console.warn(`No api report json found!`)
  return
}

const apiUsageJson = require(apiUsagePath)

function generateBackButton() {
  return `
    <button id="back-button" onclick="history.back()">Go Back</button>
  `
}

function generateTable(api, routes) {
  let table = `
    <div class="api-section">
      <h2>API: ${api}</h2>
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
  `

  for (const route in routes) {
    table += `
      <tr>
        <td>${route}</td>
        <td>${routes[route]}</td>
      </tr>
    `
  }

  table += `
        </tbody>
      </table>
    </div>
  `
  return table
}

function generateApiUsageHtml(apiUsage) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Usage Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .api-section {
          margin-bottom: 20px;
        }
        .api-section h2 {
          color: #2c3e50;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table, th, td {
          border: 1px solid #ccc;
        }
        th, td {
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        #back-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        #back-button:hover {
          background-color: #2980b9;
        }
      </style>
    </head>
    <body>
      <h1>API Usage Report</h1>
  `

  // Insert back button
  html += generateBackButton()

  // Insert tables for each API
  for (const api in apiUsage) {
    html += generateTable(api, apiUsage[api])
  }

  // End the HTML
  html += `
    </body>
    </html>
  `

  return html
}

// Example usage
const apiUsage = {
  jsonplaceholder: {
    'get /todos/1': 2,
    'get /posts': 5,
  },
  anotherapi: {
    'post /users': 3,
    'get /users/1': 1,
  },
}

// Generate HTML
const htmlOutput = generateApiUsageHtml(apiUsageJson)

fs.writeFileSync(
  path.join(__dirname, '..', 'reports', 'coverage.html'),
  htmlOutput
)
