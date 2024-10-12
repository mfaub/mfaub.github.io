document.getElementById('reportForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    // Get values from the form
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const email = document.getElementById('email').value;
    
    // Date validation
    if (new Date(endDate) < new Date(startDate)) {
      document.getElementById('status').innerText = 'Error: End date cannot be earlier than start date.';
      return;
    }
    
    // Get checked columns
    let columns = [];
    if (document.getElementById('offerID').checked) columns.push('Offer ID');
    if (document.getElementById('LoyaltyProgramID').checked) columns.push('Loyalty Program Id');
    if (document.getElementById('TotalNumberofTransactions').checked) columns.push('Total Number of Transactions');
    if (document.getElementById('TotalNumberofLoyaltyTransactions').checked) columns.push('Total Number of Loyalty Transactions');
    if (document.getElementById('SubtotalforallLoyaltyTransactions').checked) columns.push('Subtotal for all Loyalty Transactions');
    
    // Add more conditions as needed
    
    // Construct the API request payload
    const reportRequestPayload = {
      report_request: {
        report_type: reportType,
        report_params: {
            start_date: startDate,
            end_date: endDate,
            loyalty_program_id: null,
            store_id: storeid,
            store_list_id: storelistid
            
        },
        output_format: "csv",
        output_params: {
            columns: columns
        },
        delivery_method: "email",
        delivery_params: {
            recipient_address: email,
            subject: "It actually worked!"
        }
    }
  };
    
    // Save the form data to localStorage
    localStorage.setItem('reportFormData', JSON.stringify(reportRequestPayload));
    
    // Fetch the authentication token (if needed)
    let authToken = localStorage.getItem('authToken');
    if (!authToken || isTokenExpired()) {
      authToken = await fetchAuthToken();
      localStorage.setItem('authToken', authToken);
    }
    
    // Send the report request
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://api-staging.sparkfly.com/v2.0/reporting/report_requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `${authToken}`
        },
        body: JSON.stringify(reportRequestPayload)
      });
      
      const result = await response.json();
      if (response.ok) {
        document.getElementById('status').innerText = result.status;
      } else {
        document.getElementById('status').innerText = 'Error: ' + (result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      document.getElementById('status').innerText = 'Error: ' + error.message;
    }
  });
  
  // Load the form data from localStorage when the page loads
  window.addEventListener('load', function () {
    const savedData = localStorage.getItem('reportFormData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      document.getElementById('reportType').value = formData.report_request.report_type;
      document.getElementById('startDate').value = formData.report_request.report_params.start_date;
      document.getElementById('endDate').value = formData.report_request.report_params.end_date;
      document.getElementById('email').value = formData.report_request.delivery_params.recipient_address;
      
      // Set the checkboxes
      formData.report_request.output_params.columns.forEach(column => {
        const checkbox = document.querySelector(`input[value="${column}"]`);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }
  });
  
  async function fetchAuthToken() {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://api-staging.sparkfly.com/auth', {
      method: 'GET',
      headers: {
        'X-Auth-Identity': 'attentive_sandbox_pos',
        'X-Auth-Key': 'eada95bebf6f26ae0a7066cad7d75e71'
      }
    });
    
    if (response.status === 204) {
      return response.headers.get('X-Auth-Token');
    } else {
      throw new Error('Failed to authenticate');
    }
  }
  
  function isTokenExpired() {
    // Implement logic to check if the token is expired (e.g., based on time stored in localStorage)
    return false;
  }
  
