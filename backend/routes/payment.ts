import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function createPaymentOrder(req: any, res: any) {
  try {
    const { eventId, amount, registrationData } = req.body;

    // Validate required fields
    if (!eventId || !amount || !registrationData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: eventId, amount, registrationData'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `event_${eventId}_${Date.now()}`,
      notes: {
        eventId: eventId,
        userEmail: registrationData.email,
        userName: registrationData.fullName,
        userPhone: registrationData.phone,
        institution: registrationData.institution
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
}

export async function verifyPayment(req: any, res: any) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationData,
      eventId
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification data'
      });
    }

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status === 'captured') {
      // Payment is successful - here you would typically:
      // 1. Save registration to database
      // 2. Send confirmation email
      // 3. Generate registration ID/ticket

      console.log('Payment successful:', {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: payment.amount,
        registrationData,
        eventId
      });

      // TODO: Implement database save and email sending
      
      res.json({
        success: true,
        message: 'Payment verified and registration completed',
        paymentId: razorpay_payment_id,
        registrationId: `REG_${eventId}_${Date.now()}`
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
}