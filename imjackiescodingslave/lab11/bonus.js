// This is an array showing monthly sales
monthly_sales = [1, 3, 5, 7, 9, 10000];

// Tax rate
tax_rate = 0.41;

tax_owing = [];

// This function multiplies each sales entry with the tax rate, then logs it
function calcTax() {

    for (i = 0; i < monthly_sales.length; i++) {
        tax_owing = monthly_sales[i] * tax_rate;
        console.log("$" + monthly_sales[i] + " owes $" + tax_owing.toFixed(2) + " of tax.");
    }
}

calcTax();