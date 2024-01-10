exports.currencyConversionMiddleware = async (req, res, next) => {
    let { currency,processing,confirmed } = req.body;
    currency = "pkr"
  
    // **->End req.form and req.body handing*********************
  
    const conversionRates = {
        pkr: 1,      // Assuming 1 PKR is the base rate
        usd: 230,    // Example rate: 1 USD = 230 PKR
        pound: 300,  // Example rate: 1 Pound = 300 PKR
    };
    // // Check if currency provided is valid
    if (!conversionRates[currency]) {
        return res.status(400).json({ error: 'Invalid Currency Provided' });
    }
  
    const conversionRate = conversionRates[currency];
  
    if (processing) {
        if (processing.processingFee) {
            processing.processingFee *= conversionRate;
        }
        if (processing.visaFee) {
            processing.visaFee *= conversionRate;
        }
    }
   
    if (confirmed && confirmed.totalFee) {
        confirmed.totalFee *= conversionRate;
    }
  
    req.update = { processing, confirmed }
  
    next();
  }