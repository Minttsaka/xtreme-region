"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  CreditCard,
  Smartphone,
  Shield,
  Clock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Phone,
  Wallet,
} from "lucide-react"
import Link from "next/link"

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("complete")
  const [selectedPayment, setSelectedPayment] = useState("airtel")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = {
    conversations: {
      name: "Live Conversations",
      originalPrice: "30,000",
      features: ["Unlimited AI conversations", "Real-time voice interaction", "Priority support"],
      popular: false,
    },
    transcriptions: {
      name: "Transcriptions",
      originalPrice: "15,000",
      features: ["Unlimited transcriptions", "High accuracy AI", "Multiple formats"],
      popular: false,
    },
    complete: {
      name: "Complete Package",
      price: "40,000",
      originalPrice: "45,000",
      features: ["Everything included", "Priority processing", "Advanced analytics", "API access"],
      popular: true,
    },
  }

  const handleSubscribe = async () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Subscription
            </h1>
            <p className="text-xl text-muted-foreground">Choose your plan and payment method to get started</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Select Your Plan
                </CardTitle>
                <CardDescription>Choose the plan that best fits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  {Object.entries(plans).map(([key, plan]) => (
                    <div key={key} className="space-y-2">
                      <div
                        className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                          selectedPlan === key ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{plan.name}</span>
                                {plan.popular && (
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {plan.features.slice(0, 2).join(" • ")}
                              </div>
                            </div>
                            <div className="text-right">
                              {plan.originalPrice && (
                                <div className="text-sm text-muted-foreground line-through">
                                  MWK {plan.originalPrice}
                                </div>
                              )}
                              <div className="font-bold text-lg">MWK {plan.originalPrice}</div>
                              <div className="text-sm text-muted-foreground">per month</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <Separator className="my-6" />

                {/* Selected Plan Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold">What's included:</h3>
                  <ul className="space-y-2">
                    {plans[selectedPlan as keyof typeof plans].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Choose your preferred mobile money provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      selectedPayment === "airtel" ? "border-red-500 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value="airtel" id="airtel" />
                    <Label htmlFor="airtel" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Airtel Money</div>
                        <div className="text-sm text-muted-foreground">Pay with your Airtel Money account</div>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      selectedPayment === "tnm" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value="tnm" id="tnm" />
                    <Label htmlFor="tnm" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">TNM Mpamba</div>
                        <div className="text-sm text-muted-foreground">Pay with your TNM Mpamba account</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., 0881234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your {selectedPayment === "airtel" ? "Airtel" : "TNM"} phone number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">PIN</Label>
                  <Input
                    id="pin"
                    type="tel"
                    placeholder="e.g., 0881234567"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your {selectedPayment === "airtel" ? "Airtel" : "TNM"} PIN
                  </p>
                </div>

                {/* Error Alert */}
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Service Temporarily Unavailable</strong>
                    <br />
                    We're currently working on integrating mobile money payments. This feature will be available soon.
                    Thank you for your patience!
                  </AlertDescription>
                </Alert>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{plans[selectedPlan as keyof typeof plans].name}</span>
                      <span>MWK {plans[selectedPlan as keyof typeof plans].originalPrice}</span>
                    </div>
                    {plans[selectedPlan as keyof typeof plans].originalPrice && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Savings</span>
                        <span>
                          -MWK{" "}
                          {Number.parseInt(plans[selectedPlan as keyof typeof plans].originalPrice!) -
                            Number.parseInt(plans[selectedPlan as keyof typeof plans].originalPrice)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>MWK {plans[selectedPlan as keyof typeof plans].originalPrice}/month</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubscribe}
                //   disabled={!phoneNumber || isProcessing}
                disabled
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">🔒 Secure payment processing</p>
                  <p className="text-xs text-muted-foreground">
                    By subscribing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Features */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <Shield className="w-8 h-8 mx-auto text-green-600" />
                  <h3 className="font-semibold">Secure Payments</h3>
                  <p className="text-sm text-muted-foreground">Bank-level security for all transactions</p>
                </div>
                <div className="space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-blue-600" />
                  <h3 className="font-semibold">Instant Activation</h3>
                  <p className="text-sm text-muted-foreground">Your subscription activates immediately after payment</p>
                </div>
                <div className="space-y-2">
                  <Phone className="w-8 h-8 mx-auto text-purple-600" />
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Get help whenever you need it</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
