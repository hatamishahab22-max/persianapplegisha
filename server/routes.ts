import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Send, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AppleIdManager() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    country: "",
    securityQuestion1: "",
    securityAnswer1: "",
    securityQuestion2: "",
    securityAnswer2: "",
    securityQuestion3: "",
    securityAnswer3: ""
  });

  const securityQuestions = [
    "What is your favorite sport?",
    "What is your dream job?",
    "What is your favorite food?",
    "What city were you born in?",
    "What is your lucky number?",
    "What is your favorite color?",
    "Who is your best friend?",
    "What is your first pet's name?"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.birthday || !formData.country) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/apple-id-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
      setOrderCreated(data);
      
      toast({
        title: "Success!",
        description: "Your order has been created successfully",
        className: "bg-green-500 text-white border-none"
      });

      setFormData({
        name: "",
        email: "",
        birthday: "",
        country: "",
        securityQuestion1: "",
        securityAnswer1: "",
        securityQuestion2: "",
        securityAnswer2: "",
        securityQuestion3: "",
        securityAnswer3: ""
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Vazirmatn'] p-4 md:p-6" dir="ltr">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => setLocation("/products")}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">Apple ID Verified</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {orderCreated ? (
          <div className="bg-white/5 border border-green-500 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-green-500 mb-4">Order Confirmed</h2>
            <div className="space-y-3 text-sm md:text-base">
              <p><span className="text-white/60">Order ID:</span> {orderCreated.id}</p>
              <p><span className="text-white/60">Name:</span> {orderCreated.name}</p>
              <p><span className="text-white/60">Email:</span> {orderCreated.email}</p>
              <p><span className="text-white/60">Birthday:</span> {orderCreated.birthday}</p>
              <p><span className="text-white/60">Country:</span> {orderCreated.country}</p>
              <p><span className="text-white/60">Status:</span> {orderCreated.status}</p>
            </div>
            <button
              onClick={() => {
                setOrderCreated(null);
                setFormData({
                  name: "",
                  email: "",
                  birthday: "",
                  country: "",
                  securityQuestion1: "",
                  securityAnswer1: "",
                  securityQuestion2: "",
                  securityAnswer2: "",
                  securityQuestion3: "",
                  securityAnswer3: ""
                });
              }}
              className="mt-6 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-colors"
            >
              Create Another Order
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Basic Information */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 md:p-6 space-y-4">
              <h3 className="text-lg font-bold">Basic Information</h3>
              
              <div>
                <label className="text-sm text-white/70 block mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 block mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 block mb-2">Birthday (Gregorian) *</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 block mb-2">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Security Questions */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 md:p-6 space-y-4">
              <h3 className="text-lg font-bold">Security Questions</h3>
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-2">
                  <label className="text-sm text-white/70 block">Question {num}</label>
                  <select
                    name={`securityQuestion${num}`}
                    value={formData[`securityQuestion${num}` as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">Select a question...</option>
                    {securityQuestions.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    name={`securityAnswer${num}`}
                    value={formData[`securityAnswer${num}` as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={`Answer to question ${num}`}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Create Apple ID
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
