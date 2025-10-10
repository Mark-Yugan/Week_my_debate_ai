import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  CreditCard, 
  Shield,
  CheckCircle,
  Loader2,
  Calendar,
  Trophy
} from 'lucide-react';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    emoji: string;
    shortDesc?: string;
    date: string;
    format?: string;
    venue?: string;
    participants?: string;
    price?: number;
    location?: string;
    time?: string;
    fullDescription?: string;
    features?: string[];
    schedule?: Array<{ time: string; event: string; }>;
    prizes?: string;
    badges?: Array<{ text: string; color: string; }>;
  } | null;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  year: string;
  city: string;
  experience: string;
}

const EventRegistrationModal = ({ isOpen, onClose, event }: EventRegistrationModalProps) => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    year: '',
    city: '',
    experience: ''
  });

  // Return null if no event is provided
  if (!event || !isOpen) {
    return null;
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.fullName && 
           formData.email && 
           formData.phone && 
           formData.institution && 
           formData.city;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    
    // Proceed to payment
    setTimeout(() => {
      setLoading(false);
      setStep('payment');
    }, 1000);
  };

  const handlePayment = async () => {
    console.log('Payment button clicked');
    setLoading(true);
    
    try {
      // Check if Razorpay is available
      if (!(window as any).Razorpay) {
        alert('Razorpay SDK not loaded. Please refresh the page and try again.');
        console.error('Razorpay SDK not found on window object');
        setLoading(false);
        return;
      }

      console.log('Razorpay SDK loaded successfully');

      // Check if we're in demo mode (no real Razorpay key)
      const isDemoMode = !import.meta.env.VITE_RAZORPAY_KEY_ID || 
                        import.meta.env.VITE_RAZORPAY_KEY_ID === 'rzp_test_1234567890';

      if (isDemoMode) {
        // Demo mode - simulate payment success
        console.log('Running in demo mode - simulating payment success');
        setTimeout(() => {
          setStep('success');
          setLoading(false);
        }, 2000);
        return;
      }

      // For production, create order via backend API
      const mockOrder = {
        id: `order_${Date.now()}`,
        amount: (event.price || 200) * 100, // Convert to paise
        currency: 'INR'
      };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Demo key
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        name: 'MyDebate.AI',
        description: `Registration for ${event.title}`,
        image: '/lovable-uploads/80a86b55-ac06-4e1e-905b-e5574803f537.png',
        order_id: mockOrder.id,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          // In production, verify payment on backend
          setTimeout(() => {
            setStep('success');
            setLoading(false);
          }, 1000);
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          event_id: event.id.toString(),
          event_title: event.title,
          user_name: formData.fullName,
          user_email: formData.email
        },
        theme: {
          color: '#009'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setLoading(false);
          },
          escape: true,
          backdropclose: false
        }
      };

      // Create Razorpay instance and open payment modal
      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('form');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      institution: '',
      year: '',
      city: '',
      experience: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-2xl p-6">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-50 rounded-lg"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] rounded-t-lg"></div>
          
          <div className="relative z-10 space-y-6">
            <DialogHeader className="space-y-4 pb-6 mb-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-4 px-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#009] rounded-xl blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-3 rounded-xl shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#009] via-[#0066cc] to-[#004499] bg-clip-text text-transparent">
                    {event.emoji} {event.title}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 font-light mt-2">
                    Complete your registration for this exciting debate event
                  </DialogDescription>
                </div>
                <Badge className="bg-gradient-to-r from-[#009] to-[#0066cc] text-white px-4 py-2 text-lg font-semibold shadow-sm">
                  ₹{event.price || 200}
                </Badge>
              </div>
              
              {/* Event Details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-[#009]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-[#009]" />
                  <span>{event.venue || event.format}</span>
                </div>
              </div>
            </DialogHeader>

            {/* Step Content */}
            <div className="px-2 py-4">
              {step === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                    {/* Full Name */}
                    <div className="space-y-3 p-2">
                      <Label htmlFor="fullName" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <User className="h-4 w-4 text-[#009]" />
                        <span>Full Name *</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                        className="border-gray-300 focus:border-[#009] focus:ring-[#009]/20"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-3 p-2">
                      <Label htmlFor="email" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Mail className="h-4 w-4 text-[#009]" />
                        <span>Email Address *</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                        className="border-gray-300 focus:border-[#009] focus:ring-[#009]/20"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-3 p-2">
                      <Label htmlFor="phone" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Phone className="h-4 w-4 text-[#009]" />
                        <span>Phone Number *</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                        className="border-gray-300 focus:border-[#009] focus:ring-[#009]/20"
                        required
                      />
                    </div>

                    {/* Institution */}
                    <div className="space-y-3 p-2">
                      <Label htmlFor="institution" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <GraduationCap className="h-4 w-4 text-[#009]" />
                        <span>Institution/College *</span>
                      </Label>
                      <Input
                        id="institution"
                        type="text"
                        placeholder="Enter your institution name"
                        value={formData.institution}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('institution', e.target.value)}
                        className="border-gray-300 focus:border-[#009] focus:ring-[#009]/20"
                        required
                      />
                    </div>

                    {/* Year of Study */}
                    <div className="space-y-3 p-2">
                      <Label htmlFor="year" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Trophy className="h-4 w-4 text-[#009]" />
                        <span>Year of Study</span>
                      </Label>
                      <Input
                        id="year"
                        type="text"
                        placeholder="e.g., 2nd Year, Final Year"
                        value={formData.year}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('year', e.target.value)}
                        className="border-gray-300 focus:border-[#009] focus:ring-[#009]/20"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-3 p-2">
                      <Label htmlFor="city" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <MapPin className="h-4 w-4 text-[#009]" />
                        <span>City *</span>
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('city', e.target.value)}
                        className="border-gray-300 focus:border-[#009] focus:ring-[#009]/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3 p-4">
                    <Label htmlFor="experience" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Shield className="h-4 w-4 text-[#009]" />
                      <span>Debate Experience (Optional)</span>
                    </Label>
                    <Input
                      id="experience"
                      type="text"
                      placeholder="Brief description of your debate experience"
                      value={formData.experience}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('experience', e.target.value)}
                      className="border-gray-300 focus:border-[#009] focus:ring-[#009]/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6 px-4 pb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetModal}
                      className="flex-1 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormValid() || loading}
                      className="flex-1 bg-gradient-to-r from-[#009] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004499] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {step === 'payment' && (
                <div className="text-center space-y-6 py-8 px-6">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-[#009] rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] rounded-full p-6 shadow-2xl">
                      <CreditCard className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      You're almost there! Complete your payment of <span className="font-semibold text-[#009]">₹{event.price || 200}</span> to secure your spot.
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 max-w-md mx-auto">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Registration</span>
                        <span className="font-semibold">₹200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-semibold">₹0</span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-[#009]">₹200</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 px-4 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('form')}
                      className="flex-1 hover:bg-gray-50"
                    >
                      Back to Form
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-[#009] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004499] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Pay with Razorpay
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center space-y-6 py-8 px-6">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-2xl">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">Registration Successful!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Congratulations! You have successfully registered for <span className="font-semibold text-[#009]">{event.title}</span>. 
                      A confirmation email has been sent to your registered email address.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 backdrop-blur-sm rounded-xl border border-green-200/50 p-6 max-w-md mx-auto">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Registration ID:</p>
                      <p className="font-mono text-lg font-bold text-[#009]">REG-{event.id}-{Date.now().toString().slice(-6)}</p>
                    </div>
                  </div>

                  <div className="px-4 pt-2">
                    <Button
                      onClick={resetModal}
                      className="bg-gradient-to-r from-[#009] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004499] text-white font-medium px-8 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;