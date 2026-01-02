import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, School, CheckCircle, CreditCard, FileText } from "lucide-react";
import { Link } from "wouter";

const schoolSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6),
  principalName: z.string().min(2, "Principal name is required"),
  gstNumber: z.string().optional(),
  tinNumber: z.string().optional(),
  panNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  studentCount: z.number().min(1, "Student count must be at least 1"),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

const productOptions = [
  { value: "parikshanai-questionbank", label: "ParikshanAI + Question Bank", price: 10, unit: "per student/month" },
  { value: "school-safal", label: "School SAFAL", price: 2, unit: "per student" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [contractYears, setContractYears] = useState(1);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      principalName: "",
      gstNumber: "",
      tinNumber: "",
      panNumber: "",
      registrationNumber: "",
      studentCount: 100,
    },
  });

  const studentCount = form.watch("studentCount");
  const selectedProductInfo = productOptions.find(p => p.value === selectedProduct);
  const calculateTotal = () => {
    if (!selectedProductInfo) return 0;
    if (selectedProduct === "school-safal") {
      return selectedProductInfo.price * (studentCount || 0);
    }
    return selectedProductInfo.price * (studentCount || 0) * contractYears * 12;
  };

  const onSubmitSchool = async (data: SchoolFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/schools/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setSchoolId(result.id);
        setStep(2);
        toast({ title: "School registered successfully!", description: "Please select a product to continue." });
      } else {
        toast({ title: "Registration failed", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to register school", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const onSelectProduct = async () => {
    if (!schoolId || !selectedProduct) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId,
          productType: selectedProduct,
          studentCount,
          contractYears,
        }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setSubscriptionId(result.id);
        setStep(3);
        toast({ title: "Subscription created!", description: "Proceed to payment." });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create subscription", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const onPayment = async () => {
    if (!subscriptionId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      
      const order = await res.json();
      
      if (res.ok) {
        if (order.key === "rzp_test_placeholder") {
          await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: order.paymentId,
              razorpayPaymentId: "pay_demo_" + Date.now(),
              razorpayOrderId: order.orderId,
              razorpaySignature: "demo_signature",
            }),
          });
          
          setStep(4);
          toast({ title: "Demo payment successful!", description: "Awaiting admin approval." });
        } else {
          const options = {
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            name: "SmartGenEduX",
            description: selectedProductInfo?.label || "Subscription",
            order_id: order.orderId,
            handler: async function (response: any) {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paymentId: order.paymentId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              
              if (verifyRes.ok) {
                setStep(4);
                toast({ title: "Payment successful!", description: "Awaiting admin approval." });
              }
            },
            prefill: {
              email: form.getValues("email"),
              contact: form.getValues("phone"),
            },
            theme: {
              color: "#1F6FE1",
            },
          };
          
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } else {
        toast({ title: "Error", description: order.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to initiate payment", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lightbg to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-4" data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? "gradient-blue-orange text-white" : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 4 && <div className={`w-12 h-1 ${step > s ? "bg-brand-blue" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-blue-orange flex items-center justify-center mb-4">
                <School className="h-8 w-8 text-white" />
              </div>
              <h1 className="font-heading font-bold text-2xl text-brand-text dark:text-white">School Registration</h1>
              <p className="text-muted-foreground text-sm mt-2">Enter your school details to get started</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitSchool)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school name" {...field} data-testid="input-school-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="school@example.com" {...field} data-testid="input-school-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9999999999" {...field} data-testid="input-school-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="principalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principal Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Principal's full name" {...field} data-testid="input-principal-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full school address" {...field} data-testid="input-school-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} data-testid="input-school-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} data-testid="input-school-state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode *</FormLabel>
                        <FormControl>
                          <Input placeholder="600001" maxLength={6} {...field} data-testid="input-school-pincode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="studentCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Students *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="100" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-student-count" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4 mt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Business Documentation (Optional)
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number</FormLabel>
                          <FormControl>
                            <Input placeholder="22AAAAA0000A1Z5" {...field} data-testid="input-gst" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tinNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TIN Number</FormLabel>
                          <FormControl>
                            <Input placeholder="TIN number" {...field} data-testid="input-tin" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number</FormLabel>
                          <FormControl>
                            <Input placeholder="AAAAA0000A" {...field} data-testid="input-pan" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="School registration number" {...field} data-testid="input-registration" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-blue-orange text-white mt-6"
                  disabled={isSubmitting}
                  data-testid="button-submit-school"
                >
                  {isSubmitting ? "Registering..." : "Continue to Product Selection"}
                </Button>
              </form>
            </Form>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-green-blue flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h1 className="font-heading font-bold text-2xl text-brand-text dark:text-white">Select Product</h1>
              <p className="text-muted-foreground text-sm mt-2">Choose the product you want to subscribe to</p>
            </div>

            <div className="space-y-4 mb-6">
              {productOptions.map((product) => (
                <div
                  key={product.value}
                  onClick={() => setSelectedProduct(product.value)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedProduct === product.value ? "border-brand-blue bg-brand-blue/5" : "border-muted"
                  }`}
                  data-testid={`product-option-${product.value}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-brand-text dark:text-white">{product.label}</h3>
                      <p className="text-sm text-muted-foreground">₹{product.price} {product.unit}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedProduct === product.value ? "border-brand-blue bg-brand-blue" : "border-muted"
                    }`}>
                      {selectedProduct === product.value && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedProduct && selectedProduct !== "school-safal" && (
              <div className="mb-6">
                <Label>Contract Duration</Label>
                <Select value={contractYears.toString()} onValueChange={(v) => setContractYears(parseInt(v))}>
                  <SelectTrigger data-testid="select-contract-years">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="2">2 Years</SelectItem>
                    <SelectItem value="3">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedProduct && (
              <div className="bg-muted rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span>Students</span>
                  <span>{studentCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Price per student</span>
                  <span>₹{selectedProductInfo?.price}</span>
                </div>
                {selectedProduct !== "school-safal" && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Duration</span>
                    <span>{contractYears} year(s) = {contractYears * 12} months</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-brand-blue">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            )}

            <Button 
              className="w-full gradient-blue-orange text-white"
              disabled={!selectedProduct || isSubmitting}
              onClick={onSelectProduct}
              data-testid="button-continue-payment"
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-blue-orange flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h1 className="font-heading font-bold text-2xl text-brand-text dark:text-white">Complete Payment</h1>
              <p className="text-muted-foreground text-sm mt-2">Secure payment via Razorpay</p>
            </div>

            <div className="bg-muted rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
                <p className="text-4xl font-bold text-brand-blue">₹{calculateTotal().toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedProductInfo?.label}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-brand-green" />
                <span>Secure payment with 256-bit encryption</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-brand-green" />
                <span>Supports UPI, Credit/Debit Cards, Net Banking</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-brand-green" />
                <span>Invoice and receipt generated after payment</span>
              </div>
            </div>

            <Button 
              className="w-full gradient-blue-orange text-white"
              disabled={isSubmitting}
              onClick={onPayment}
              data-testid="button-pay-now"
            >
              {isSubmitting ? "Processing..." : `Pay ₹${calculateTotal().toLocaleString()}`}
            </Button>
          </Card>
        )}

        {step === 4 && (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-brand-green flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-brand-text dark:text-white mb-2">
              Registration Complete!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your payment has been received. Our team will review your registration and grant access within 24-48 hours.
              You will receive a confirmation email once approved.
            </p>
            <div className="bg-muted rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue font-bold">1.</span>
                  Admin reviews your registration
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue font-bold">2.</span>
                  Access is granted to your selected products
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue font-bold">3.</span>
                  You receive login credentials via email
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue font-bold">4.</span>
                  Legal documents (Invoice, Agreement) are generated
                </li>
              </ul>
            </div>
            <Link href="/">
              <Button className="gradient-blue-orange text-white" data-testid="button-back-to-home">
                Back to Home
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
